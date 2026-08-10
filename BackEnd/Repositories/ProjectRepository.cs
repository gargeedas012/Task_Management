using BackEnd.Models;
using BackEnd.Settings;
using BackEnd.Interfaces;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BackEnd.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly IMongoCollection<Project> _projectCollection;
    
        public ProjectRepository(IOptions<TodoDatabaseSettings> databaseSettings)
        {
            var client= new MongoClient(databaseSettings.Value.ConnectionString);
            var database= client.GetDatabase(databaseSettings.Value.DatabaseName);
            _projectCollection= database.GetCollection<Project>(databaseSettings.Value.ProjectCollectionName);
        }
        public async Task CreateProjectAsync(Project project)
        {
            await _projectCollection.InsertOneAsync(project);
        }
        public async Task<List<Project>> GetAllProjectsAsync()
        {
            return await _projectCollection.Find(_ => true).ToListAsync();
        }
        public async Task<List<Project>> GetProjectsByUserIdAsync(string userId)
        {
            return await _projectCollection.Find(x => x.UserId == userId).ToListAsync();
        }
        public async Task UpdateProjectAsync(string userId, Project project)
        {
            await _projectCollection.ReplaceOneAsync(x => x.UserId == userId, project);
        }
        public async Task DeleteProjectAsync(string userId)
        {
            await _projectCollection.DeleteOneAsync(x => x.UserId == userId);
        }
    }
}