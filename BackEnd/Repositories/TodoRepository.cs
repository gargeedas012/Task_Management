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
                .Set(x => x.IsCompleted, todo.IsCompleted)
                .Set(x => x.Priority, todo.Priority)
                .Set(x => x.DueDate, todo.DueDate)
                .Set(x => x.Category, todo.Category);

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
                .Find(x => x.UserId == userId)
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
        public async Task<List<InCompleteTodoResponseDto>> GetIncompleteTodos(bool isCompleted)
        {
            var pipeline = new[]
            {
                new BsonDocument("$match",
                    new BsonDocument("IsCompleted", isCompleted)),
                    new BsonDocument("$project",
                    new BsonDocument
                        {
                            { "_id", 0 },
                            { "createdDate", 0 }
                        }),
                    new BsonDocument("$sort",
                    new BsonDocument("Priority", 1))
            };
            var result = await _todoCollection.Aggregate<InCompleteTodoResponseDto>(pipeline).ToListAsync();
            return result;
        }
        public async Task<List<PriorityCountDto>> GetPriorityCount()
        {
            var pipeline = new[]
            {
                new BsonDocument("$group",
                new BsonDocument
                    {
                        { "_id", "$Priority" },
                        { "Total",
                new BsonDocument("$sum", 1) }
                    })
            };
            var result = await _todoCollection.Aggregate<PriorityCountDto>(pipeline).ToListAsync();
            return result;
        }

        public async Task<List<Todo>> SearchAsync(string SearchText)
        {
            var filter = Builders<Todo>.Filter.Empty;
            if(!string.IsNullOrEmpty(SearchText))
            {
                filter = Builders<Todo>.Filter.Or(
                    Builders<Todo>.Filter.Regex(
                        x=>x.Title,
                        new BsonRegularExpression(SearchText,"i")
                        )
                    );
            }
            return await _todoCollection.Find(filter).ToListAsync();
        }

        public async Task<List<TodoByDateDto>> GetTodosByDateAsync(
            string projectId,
            DateTime startDate,
            int page,
            int pagesize,
            string filterType)
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

            var filter = Builders<Todo>.Filter.And(
                Builders<Todo>.Filter.Eq(
                    x => x.ProjectId,
                    projectId
                ),

                Builders<Todo>.Filter.Gte(
                    x => x.CreatedDate,
                    startDate
                ),

                Builders<Todo>.Filter.Lt(
                    x => x.CreatedDate,
                    endDate
                )
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
    }
}