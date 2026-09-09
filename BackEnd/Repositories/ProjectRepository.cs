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
        public async Task<List<GetAllProjectsInfo>> GetProjectsByUserIdAsync(string userId)
        {
            var filter = Builders<Project>.Filter.AnyEq( x => x.ProjectMemberId,userId);
            var result= await _projectCollection.Aggregate().Match(filter).AppendStage<Project>(
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
                ).AppendStage<Project>(
                new BsonDocument(
                        "$lookup", new BsonDocument {
                              { "from", "User" },
                              { "let", new BsonDocument("projectManagerId", new BsonDocument("$toObjectId", "$ProjectManagerId")) },
                              { "pipeline",new BsonArray
                                {
                                    new BsonDocument("$match", new BsonDocument("$expr",
                                            new BsonDocument("$eq",new BsonArray
                                            {
                                                "$$projectManagerId",
                                                "$_id"
                                            })))
                                }
                              },
                              { "as", "UserInfo" }
                        }
                    )
                ).AppendStage<Project>(new BsonDocument("$addFields", new BsonDocument
                    {
                        {"ProjectManager", new BsonDocument("$arrayElemAt", new BsonArray{"$UserInfo.Username",0}) },
                        { "TotalTask", new BsonDocument("$size", "$Todos") },
                        { "CompletedTask", new BsonDocument("$size", new BsonDocument("$filter", new BsonDocument
                            {
                                { "input", "$Todos" },
                                { "as", "todos" },
                                { "cond", new BsonDocument("$eq", new BsonArray
                                    {
                                        "$$todos.Status",4
                                    })}
                            }
                        ))}
                    })
                ).Project<GetAllProjectsInfo>( new BsonDocument
                    {
                        { "Todos", 0 },
                        { "Client", 0 },
                        { "ProjectMemberId", 0 },
                    {"ProjectManagerId" ,0},
                    {"UserInfo",0 }
                    }
                )
                .Sort(new BsonDocument("DueDate", 1))
                .ToListAsync();
            return result;
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


        public async Task<List<ProjectInfoDto>> GetProjectAssigneInfo(string userId)
                {
                    var filter = Builders<Project>.Filter.AnyEq(x => x.ProjectMemberId, userId);

                    var result = await _projectCollection
                        .Aggregate()
                        .Match(filter)
                        .AppendStage<Project>(
                            new BsonDocument("$lookup", new BsonDocument
                            {
                        { "from", "Todos" },
                        { "let", new BsonDocument("projectId", new BsonDocument("$toString", "$_id")) },
                        { "pipeline", new BsonArray
                            {
                                new BsonDocument("$match", new BsonDocument("$expr",
                                    new BsonDocument("$eq", new BsonArray { "$ProjectId", "$$projectId" }))),

                                new BsonDocument("$group", new BsonDocument
                                {
                                    { "_id", BsonNull.Value },
                                    { "TotalTasks", new BsonDocument("$sum", 1) },
                                    { "CompletedTasks", new BsonDocument("$sum",
                                        new BsonDocument("$cond", new BsonArray
                                        {
                                            new BsonDocument("$eq", new BsonArray { "$Status", 4 }),
                                            1,
                                            0
                                        })) },
                                    { "InProgressTasks", new BsonDocument("$sum",
                                        new BsonDocument("$cond", new BsonArray
                                        {
                                            new BsonDocument("$eq", new BsonArray { "$Status", 1 }),
                                            1,
                                            0
                                        })) },
                                     { "TodoTasks", new BsonDocument("$sum",
                                        new BsonDocument("$cond", new BsonArray
                                        {
                                            new BsonDocument("$eq", new BsonArray { "$Status", 0 }),
                                            1,
                                            0
                                        })) },
                                     { "ReviewTasks", new BsonDocument("$sum",
                                        new BsonDocument("$cond", new BsonArray
                                        {
                                            new BsonDocument("$eq", new BsonArray { "$Status", 3 }),
                                            1,
                                            0
                                        })) }
                                })
                            }
                        },
                        { "as", "TaskStats" }
                            })
                        )
                        .AppendStage<Project>(
                            new BsonDocument("$addFields", new BsonDocument
                            {
                        { "TotalTasks", new BsonDocument("$ifNull", new BsonArray
                            {
                                new BsonDocument("$arrayElemAt", new BsonArray { "$TaskStats.TotalTasks", 0 }),
                                0
                            }) },
                        { "CompletedTasks", new BsonDocument("$ifNull", new BsonArray
                            {
                                new BsonDocument("$arrayElemAt", new BsonArray { "$TaskStats.CompletedTasks", 0 }),
                                0
                            }) },
                        { "InProgressTasks", new BsonDocument("$ifNull", new BsonArray
                            {
                                new BsonDocument("$arrayElemAt", new BsonArray { "$TaskStats.InProgressTasks", 0 }),
                                0
                            }) },
                         { "TodoTasks", new BsonDocument("$ifNull", new BsonArray
                            {
                                new BsonDocument("$arrayElemAt", new BsonArray { "$TaskStats.TodoTasks", 0 }),
                                0
                            }) },
                          { "ReviewTasks", new BsonDocument("$ifNull", new BsonArray
                            {
                                new BsonDocument("$arrayElemAt", new BsonArray { "$TaskStats.ReviewTasks", 0 }),
                                0
                            }) }
                            })
                        )
                        .Unwind("ProjectMemberId")
                        .AppendStage<Project>(
                            new BsonDocument("$addFields",
                                new BsonDocument("MemberId",
                                    new BsonDocument("$toObjectId", "$ProjectMemberId")))
                        )
                        .AppendStage<Project>(
                            new BsonDocument("$lookup", new BsonDocument
                            {
                        { "from", "User" },
                        { "localField", "MemberId" },
                        { "foreignField", "_id" },
                        { "as", "MemberInfo" }
                            })
                        )
                        .AppendStage<Project>(
                            new BsonDocument("$group", new BsonDocument
                            {
                        { "_id", "$_id" },
                        { "Name", new BsonDocument("$first", "$Name") },
                        { "TotalTasks", new BsonDocument("$first", "$TotalTasks") },
                        { "CompletedTasks", new BsonDocument("$first", "$CompletedTasks") },
                        { "InProgressTasks", new BsonDocument("$first", "$InProgressTasks") },
                        { "TodoTasks", new BsonDocument("$first", "$TodoTasks") },
                        { "ReviewTasks", new BsonDocument("$first", "$ReviewTasks") },
                        { "Status", new BsonDocument("$first", "$Status") },
                        { "Members", new BsonDocument("$push",
                            new BsonDocument("$arrayElemAt",
                                new BsonArray { "$MemberInfo.Username", 0 }))
                        }
                            })
                        )
                        .Limit(3)
                        .As<ProjectInfoDto>()
                        .ToListAsync();

                    return result;
                }
        public async Task<List<ProjectIdNameInfo>> GetProjectsNameByUserIdAsync(string userId)
        {
            var filter = Builders<Project>.Filter.AnyEq(x => x.ProjectMemberId, userId);

            var result = await _projectCollection.Aggregate().Match(filter)
                .Project(x => new ProjectIdNameInfo
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync();
            return result;
        }
        public async Task<List<TeamMemberDto>> GetTeamMembersAsync( string projectId, string memberId)
        {
            var pipeline = _projectCollection.Aggregate()

                .Match(new BsonDocument("$expr",
                    new BsonDocument("$and", new BsonArray
                    {
                new BsonDocument("$in", new BsonArray
                {
                    memberId,
                    "$ProjectMemberId"
                }),

                new BsonDocument("$eq", new BsonArray
                {
                    new BsonDocument("$toString", "$_id"),
                    projectId
                })
                    })
                ))
                .Unwind("ProjectMemberId")
                .AppendStage<BsonDocument>(
                    new BsonDocument("$lookup",
                        new BsonDocument
                        {
                    { "from", "User" },

                    {
                        "let",
                        new BsonDocument
                        {
                            { "userId", "$ProjectMemberId" }
                        }
                    },

                    {
                        "pipeline",
                        new BsonArray
                        {
                            new BsonDocument("$match",
                                new BsonDocument("$expr",
                                    new BsonDocument("$eq",
                                        new BsonArray
                                        {
                                            new BsonDocument(
                                                "$toString",
                                                "$_id"
                                            ),
                                            "$$userId"
                                        }
                                    )
                                )
                            ),

                            new BsonDocument("$project",
                                new BsonDocument
                                {
                                    { "_id", 1 },
                                    { "Username", 1 },
                                    { "Role", 1 }
                                }
                            )
                        }
                    },

                    { "as", "userInfo" }
                        }
                    )
                )
                .Unwind("userInfo")
                .Project(new BsonDocument
                {
                    { "_id", "$userInfo._id" },
                    { "Username", "$userInfo.Username" },
                    { "Role", "$userInfo.Role" }
                })
                .As<TeamMemberDto>();
            return await pipeline.ToListAsync();
        }

    }
}