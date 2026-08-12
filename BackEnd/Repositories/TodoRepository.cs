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
        public async Task UpdateAsync(string id,Todo todo)
        {
            await _todoCollection.ReplaceOneAsync(x => x.Id == id,todo);
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

        public async Task<List<Todo>> GetTodosByProjectIdWithLimit(string projectId,int page,int pageSize)
        {
            var sort=Builders<Todo>.Sort.Descending(x=>x.CreatedDate);
            return await _todoCollection.Find(x => x.ProjectId == projectId).Sort(sort).Skip((page - 1) * pageSize).Limit(pageSize).ToListAsync();
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

        public async Task<List<TodoByDateDto>> GetTodosByDateAsync(string projectId,DateTime startDate)
        {
            var endDate = startDate.AddMonths(1);

            // 1. Builder Filter
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

            // 2. Aggregation
            var result = await _todoCollection
                .Aggregate()

                // $match
                .Match(filter)

                // $addFields
                .AppendStage<Todo>(
                    new BsonDocument("$addFields",
                        new BsonDocument("TaskDate",
                            new BsonDocument("$dateToString",
                                new BsonDocument
                                {
                            { "format", "%Y-%m-%d" },
                            { "date", "$CreatedDate" },
                            { "timezone", "Asia/Kolkata" }
                                }
                            )
                        )
                    )
                )

                // $group
                .AppendStage<BsonDocument>(
                    new BsonDocument("$group",
                        new BsonDocument
                        {
                    { "_id", "$TaskDate" },
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

                // $sort
                .Sort(
                    new BsonDocument("_id", 1)
                )

                .ToListAsync();

            // 3. Convert MongoDB result to DTO
            return result.Select(x => new TodoByDateDto
            {
                Id = x["_id"].AsString,

                Tasks = x["Tasks"]
                    .AsBsonArray
                    .Select(task =>
                        BsonSerializer.Deserialize<Todo>(
                            task.AsBsonDocument
                        )
                    )
                    .ToList()

            }).ToList();
        }
    }
}