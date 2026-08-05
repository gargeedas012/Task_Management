using BackEnd.Interfaces;
using BackEnd.Models;
using BackEnd.Settings;
using Microsoft.Extensions.Options;
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
            return await _todoCollection.Find(x => true).ToListAsync();
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
    }
}