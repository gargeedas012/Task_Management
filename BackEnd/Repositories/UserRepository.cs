using BackEnd.Interfaces;
using BackEnd.Models;
using BackEnd.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BackEnd.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _usersCollection;
        public UserRepository(IOptions<TodoDatabaseSettings> databaseSettings)
        {
            var client = new MongoClient(databaseSettings.Value.ConnectionString);
            var database = client.GetDatabase(databaseSettings.Value.DatabaseName);
            _usersCollection = database.GetCollection<User>(databaseSettings.Value.UserCollectionName);
        }
        public async Task CreateAsync(User user)
        {
            await _usersCollection.InsertOneAsync(user);
        }
        public async Task<User> GetByEmailAsync(string email)
        {
            return await _usersCollection.Find(x=>x.Email == email).FirstOrDefaultAsync();
        }
        public async Task UpdateAsync(string id, User user)
        {
            await _usersCollection.ReplaceOneAsync(
                x => x.Id == id,
                user
            );
        }
        public async Task<User> GetByRefreshTokenAsync(string refreshToken)
        {
            var user = await _usersCollection
                .Find(Builders<User>.Filter.ElemMatch(
                    x => x.RefreshTokens,
                    t => t.Token == refreshToken
                ))
                .FirstOrDefaultAsync();
            if (user == null)
            {
                return null;
            }
            return user;
        }
    }
}
