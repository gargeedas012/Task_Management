using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using BackEnd.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
namespace BackEnd.Repositories
{
    public class TodoRepository : ITodoRepository
    {
        private readonly IMongoCollection<Todo> _todoCollection;
        public TodoRepository(IOptions<TodoDatabaseSettings> databaseSettings)
        {
            var client= new MongoClient(databaseSettings.Value.ConnectionString);
            var database= client.GetDatabase(databaseSettings.Value.DatabaseName);
            _todoCollection= database.GetCollection<Todo>(databaseSettings.Value.TodoCollectionName);
        }
        public async Task<List<Todo>> GetAllAsync()
        {
            var sort=Builders<Todo>.Sort.Descending(x=>x.CreatedDate);
            return await _todoCollection.Find(FilterDefinition<Todo>.Empty).Sort(sort).ToListAsync();
        }
        public async Task<Todo?> GetByIdAsync(string id)
        {
            return await _todoCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }
        public async Task CreateAsync(Todo todo)
        {
            await _todoCollection.InsertOneAsync(todo);
        }
        public async Task UpdateAsync(string id, Todo todo)
        {
            var update = Builders<Todo>.Update
                .Set(x => x.Title, todo.Title)
                .Set(x => x.Description, todo.Description)
                .Set(x => x.Priority, todo.Priority)
                .Set(x => x.DueDate, todo.DueDate);


            await _todoCollection.UpdateOneAsync(
                x => x.Id == id,
                update
            );
        }
        public async Task DeleteAsync(string id)
        {
            await _todoCollection.DeleteOneAsync(x => x.Id == id);
        }
        public async Task<List<Todo>> GetTodosByUserIdAsync(string userId)
        {
            var sort = Builders<Todo>.Sort.Descending(x => x.CreatedDate);
            return await _todoCollection
                .Find(x => x.Id == userId)
                .Sort(sort)
                .ToListAsync();
        }
        public async Task<List<Todo>> GetTodosByProjectIdAsync(string projectId)
        {
            var sort=Builders<Todo>.Sort.Descending(x=>x.CreatedDate);
            return await _todoCollection.Find(x=>x.ProjectId == projectId).Sort(sort).ToListAsync();
        }
        public async Task<TodoListResponse> GetTodosByProjectIdWithLimit(string projectId,int page,int pageSize)
        {
            var filter=Builders<Todo>.Filter.Eq(x=>x.ProjectId,projectId);
            var sort=Builders<Todo>.Sort.Descending(x=>x.CreatedDate);
            var totalCount=await _todoCollection.CountDocumentsAsync(filter);
            var todos= await _todoCollection.Find(x => x.ProjectId == projectId).Sort(sort).Skip((page - 1) * pageSize).Limit(pageSize).ToListAsync();
            return new TodoListResponse
            {
                Todos = todos,
                TotalCount = totalCount
            };
        }
        public async Task<List<TodoByDateDto>> GetTodosByDateAsync( string projectId, DateTime startDate, int page, int pagesize, string filterType)
        {
            DateTime endDate;
            if (filterType.ToLower() == "month")
            {
                endDate = startDate.AddMonths(1);
            }
            else if (filterType.ToLower() == "day")
            {
                endDate = startDate.AddDays(1);
            }
            else
            {
                throw new ArgumentException("filterType must be 'month' or 'day'");
            }
            var filter = Builders<Todo>.Filter.And( Builders<Todo>.Filter.Eq( x => x.ProjectId, projectId),
                Builders<Todo>.Filter.Gte( x => x.CreatedDate, startDate ),
                Builders<Todo>.Filter.Lt( x => x.CreatedDate, endDate )
            );
            var result = await _todoCollection
                .Aggregate()
                .Match(filter)
                .AppendStage<BsonDocument>(
                    new BsonDocument("$group",
                        new BsonDocument
                        {
                    {
                        "_id",
                        new BsonDocument("$dateToString",
                            new BsonDocument
                            {
                                { "format", "%Y-%m-%d" },
                                { "date", "$CreatedDate" },
                                { "timezone", "Asia/Kolkata" }
                            }
                        )
                    },
                    {
                        "Tasks",
                        new BsonDocument(
                            "$push",
                            "$$ROOT"
                        )
                    }
                        }
                    )
                )
                .Sort(new BsonDocument("_id", 1))
                .ToListAsync();
            // Number of dates
            var count = result.Count;
            // Convert + paginate dates
            var response = result
                .Select(x => new TodoByDateDto
                {
                    Date = x["_id"].AsString,

                    Tasks = x["Tasks"]
                        .AsBsonArray
                        .Select(task =>
                            BsonSerializer.Deserialize<Todo>(
                                task.AsBsonDocument
                            )
                        )
                        .ToList(),

                    TotalTaskCount = count
                })
                .Skip((page - 1) * pagesize)
                .Take(pagesize)
                .ToList();

            return response;
        }
        public async Task<TaskDashboardDto?> GetTaskInfo(string UserId)
        {
            var result = await _todoCollection.Aggregate()
                // 1. Get tasks assigned to the user
                .Match(new BsonDocument("$expr", new BsonDocument("$in", new BsonArray {
                    UserId,"$AssignedTo"
                        }
                    )
                ))
                // 2. Convert ProjectId string -> ObjectId
                .AppendStage<Todo>(new BsonDocument("$addFields",new BsonDocument
                    {
                        {
                            "ProjectId",
                            new BsonDocument("$toObjectId", "$ProjectId")
                        }
                    }
                ))
                // 3. Get Project
                .AppendStage<Todo>(new BsonDocument("$lookup",new BsonDocument
                    {
                        { "from", "Projects" },
                        { "localField", "ProjectId" },
                        { "foreignField", "_id" },
                        { "as", "Projects" }
                    }
                ))
                // 4. Get ProjectName
                .AppendStage<Todo>(new BsonDocument("$addFields", new BsonDocument
                    {
                        {
                            "ProjectName",
                            new BsonDocument("$arrayElemAt",
                                new BsonArray
                                {
                                    "$Projects.Name",
                                    0
                                }
                            )
                        }
                    }
                ))
                // 5. Select required fields
                .Project(new BsonDocument
                {
                    { "_id", 1 },
                    { "Title", 1 },
                    { "ProjectName", 1 },
                    { "Status", 1 },
                    { "Priority", 1 },
                    { "DueDate", 1 }
                })
                // 6. Facet
                .AppendStage<Todo>(new BsonDocument("$facet",new BsonDocument
                 {
                    {
                        "TodayTasks",
                        new BsonArray
                        {
                            new BsonDocument("$match", new BsonDocument("$expr", new BsonDocument("$and",
                                        new BsonArray
                                        {
                                            new BsonDocument("$gte",
                                                new BsonArray
                                                {
                                                    "$DueDate",
                                                    new BsonDocument("$dateTrunc",
                                                        new BsonDocument
                                                        {
                                                            { "date", "$$NOW" },
                                                            { "unit", "day" }
                                                        }
                                                    )
                                                }
                                            ),
                                            new BsonDocument("$lt",
                                                new BsonArray
                                                {
                                                    "$DueDate",
                                                    new BsonDocument("$dateAdd",
                                                        new BsonDocument
                                                        {
                                                            {
                                                                "startDate",
                                                                new BsonDocument("$dateTrunc",
                                                                    new BsonDocument
                                                                    {
                                                                        { "date", "$$NOW" },
                                                                        { "unit", "day" }
                                                                    }
                                                                )
                                                            },
                                                            { "unit", "day" },
                                                            { "amount", 1 }
                                                        }
                                                    )
                                                }
                                            )
                                        }
                                    )
                                )
                            )
                        }
                    },
                    {
                        "UpcomingTasks", new BsonArray
                        {
                            new BsonDocument("$match", new BsonDocument("$expr", new BsonDocument("$and",
                                new BsonArray
                                {
                                    // DueDate >= tomorrow
                                    new BsonDocument("$gte",
                                        new BsonArray
                                        {
                                            "$DueDate",
                                            new BsonDocument("$dateAdd",
                                                new BsonDocument
                                                {
                                                    {
                                                        "startDate",
                                                        new BsonDocument("$dateTrunc",
                                                            new BsonDocument
                                                            {
                                                                { "date", "$$NOW" },
                                                                { "unit", "day" }
                                                            }
                                                        )
                                                    },
                                                    { "unit", "day" },
                                                    { "amount", 1 }
                                                }
                                            )
                                        }
                                    ),

                                    // DueDate < 8 days from today
                                    new BsonDocument("$lt",
                                        new BsonArray
                                        {
                                            "$DueDate",
                                            new BsonDocument("$dateAdd",
                                                new BsonDocument
                                                {
                                                    {
                                                        "startDate",
                                                        new BsonDocument("$dateTrunc",
                                                            new BsonDocument
                                                            {
                                                                { "date", "$$NOW" },
                                                                { "unit", "day" }
                                                            }
                                                        )
                                                    },
                                                    { "unit", "day" },
                                                    { "amount", 8 }
                                                }
                                            )
                                        }
                                    )
                                }
                            )
                                )
                            ),
                            new BsonDocument("$sort",
                                new BsonDocument("DueDate", 1)
                            ),
                            new BsonDocument("$limit", 3)
                    }
                }
                }
                ))
                .As<TaskDashboardDto>().FirstOrDefaultAsync();
            return result;
        }

        public Task<List<InCompleteTodoResponseDto>> GetIncompleteTodos(bool isCompleted)
        {
            throw new NotImplementedException();
        }

        public Task<List<PriorityCountDto>> GetPriorityCount()
        {
            throw new NotImplementedException();
        }

        public Task<List<Todo>> SearchAsync(string SearchText)
        {
            throw new NotImplementedException();
        }

        public Task<List<TodoResponse>> getRecentTodos(string UserId)
        {
            throw new NotImplementedException();
        }
    }
    }
