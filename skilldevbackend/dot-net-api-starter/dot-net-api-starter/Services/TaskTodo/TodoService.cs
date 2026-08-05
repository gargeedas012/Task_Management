using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Projects.Config.Db;
using Projects.Data;
using Projects.Dtos.Task;
using Projects.Models;

namespace Projects.Services.TaskTodo
{
    public class TodoService
    {
        private readonly IMongoCollection<Todo> _todoCollection;
        private readonly IMongoCollection<BsonDocument> _todoCollectionBson;

        public TodoService(IOptions<DbSettings> dbSettings)
        {
            Console.WriteLine("Connection: " + dbSettings.Value.ConnectionString);
            Console.WriteLine("Database: " + dbSettings.Value.DatabaseName);
            Console.WriteLine("Collection: " + dbSettings.Value.TaskCollectionName);
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _todoCollection = database.GetCollection<Todo>(
                DbCollections.Task
            );
            _todoCollectionBson = database.GetCollection<BsonDocument>(DbCollections.Task);
        }

        public async Task<List<Todo>> GetAllAsync()
        {
            return await _todoCollection.Find(x => true).ToListAsync();
        }
        public async Task<Todo?> GetByIdAsync(string id)
        {
            return await _todoCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }
        public async Task CreateAsync(CreateTodoDto createTodoDto)
        {
            var todo = new Todo
            {
                Title = createTodoDto.Title,
                Description = createTodoDto.Description,
                Priority = createTodoDto.Priority,
                DueDate = createTodoDto.DueDate,
                Category = createTodoDto.Category,
                IsCompleted = createTodoDto.IsCompleted,
                CreatedDate = DateTime.UtcNow
            };
            await _todoCollection.InsertOneAsync(todo);
        }
        public async Task UpdateAsync(string id, UpdateTodoDto updateTodoDto)
        {
            var todo = new Todo
            {
                Id = id,
                Title = updateTodoDto.Title,
                Description = updateTodoDto.Description,
                Priority = updateTodoDto.Priority,
                DueDate = updateTodoDto.DueDate,
                Category = updateTodoDto.Category,
                IsCompleted = updateTodoDto.IsCompleted
            };
            await _todoCollection.ReplaceOneAsync(x => x.Id == id, todo);
        }
        public async Task DeleteAsync(string id)
        {
            await _todoCollection.DeleteOneAsync(x => x.Id == id);
        }

        /*[{
            $match: {
              isCompleted: false
            }
        },
          {
            $project:
            {
            _id: 0,
              createdDate: 0
            }
        },
          {
            $sort:
            {
            priority: 1
            }
        }
        ]*/
        //flute api
        //public async Task<List<Todo>> GetIncompleteTodos()
        //{
        //    var result= await _todoCollection.Aggregate()
        //        .Match(x=>x.IsCompleted == false)
        //        .Project<Todo>(Builders<Todo>.Projection.Exclude(x=>x.Id).Exclude(x=>x.CreatedDate))
        //        .Sort(Builders<Todo>.Sort.Ascending(x => x.Priority))
        //        .ToListAsync();
        //    return result;
        //}
        //bsonelement
        public async Task<List<InCompleteTodoResponseDto>> GetIncompleteTodos(bool isCompleted)
        {
            var pipeline = new[]
            {
                new BsonDocument("$match",
                    new BsonDocument("isCompleted", isCompleted)),
                    new BsonDocument("$project",
                    new BsonDocument
                        {
                            { "_id", 0 },
                            { "createdDate", 0 }
                        }),
                    new BsonDocument("$sort",
                    new BsonDocument("priority", 1))
            };
            var result= await _todoCollection.Aggregate<InCompleteTodoResponseDto>(pipeline).ToListAsync();
            return result;
        }
        public async Task<List<PriorityCountDto>> GetPriorityCount()
        {
            var pipeline = new[]
            {
                new BsonDocument("$group",
                new BsonDocument
                    {
                        { "_id", "$priority" },
                        { "total",
                new BsonDocument("$sum", 1) }
                    })
            };
            var result= await _todoCollection.Aggregate<PriorityCountDto>(pipeline).ToListAsync();
            return result;
        }

    }
}
