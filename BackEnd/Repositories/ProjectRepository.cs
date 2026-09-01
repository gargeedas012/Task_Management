using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using BackEnd.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
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
            return await _projectCollection.Find(x => x.Id == userId).ToListAsync();
        }
        public async Task UpdateProjectAsync(string id, Project project)
        {
            var update= Builders<Project>.Update
                //.Set(x => x.UserId, project.UserId)
                .Set(x => x.Name, project.Name)
                .Set(x => x.Description, project.Description)
                .Set(x => x.DueDate, project.DueDate)
                .Set(x => x.Status, project.Status);
            await _projectCollection.UpdateOneAsync(x=>x.Id== id, update);
        }
        public async Task DeleteProjectAsync(string id)
        {
            await _projectCollection.DeleteOneAsync(x => x.Id == id);
        }
        public async Task<List<ProjectResponseDto>> getRecentProjects(string UserId)
        {
            var result=await _projectCollection.Aggregate().Match(
                Builders<Project>.Filter.Eq("UserId", UserId)
                &
                Builders<Project>.Filter.Eq("Status","Active")
                &
                new BsonDocument("$expr", new BsonDocument("$and",new BsonArray
                {
                    new BsonDocument("$gte", new BsonArray
                    {
                         "$DueDate",
                          "$$NOW"
                    }),
                    new BsonDocument("$lte", new BsonArray
                    {
                        "$DueDate",
                        new BsonDocument("$dateAdd", new BsonDocument
                        {
                            { "startDate", "$$NOW" },
                            { "unit", "month" },
                            { "amount", 1 }
                        })
                    })
                }))
                ).AppendStage<Project>(
                    new BsonDocument(
                        "$lookup", new BsonDocument {
                              { "from", "Todos" },
                              { "let", new BsonDocument("projectId", new BsonDocument("$toString", "$_id")) },
                              { "pipeline",new BsonArray
                                {
                                    new BsonDocument("$match", new BsonDocument("$expr",
                                            new BsonDocument("$eq",new BsonArray
                                            {
                                                "$$projectId",
                                                "$ProjectId"
                                            })))
                                }
                              },
                              { "as", "Todos" }
                        }
                    )
                ).AppendStage<Project>( new BsonDocument("$addFields", new BsonDocument
                    { 
                        { "TotalTask", new BsonDocument("$size", "$Todos") },
                        { "CompletedTask", new BsonDocument("$size", new BsonDocument("$filter", new BsonDocument
                            {
                                { "input", "$Todos" },
                                { "as", "todos" },
                                { "cond", new BsonDocument("$eq", new BsonArray
                                    {
                                        "$$todos.IsCompleted",true
                                    })}
                            }
                        ))},
                        { "ProjectDueDate",new BsonDocument("$dateToString",new BsonDocument
                            {
                                { "format", "%b %d, %Y" },
                                { "date", "$DueDate" },
                                { "timezone", "UTC" }
                            })}
                    })
                ).Project<ProjectResponseDto>(new BsonDocument("Todos", 0)).Sort( new BsonDocument("DueDate",1))
                .Limit(4)
                .ToListAsync();
            return result;
        }

    }
}