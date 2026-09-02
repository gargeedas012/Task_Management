using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using BackEnd.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
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

        public async Task<ProjectCountDto?> GetProjectInfo(string UserId)
        {
            var result = await _usersCollection
                .Aggregate().Match(new BsonDocument{
                    {
                        "_id", new ObjectId(UserId)
                    }
                })
                .AppendStage<User>(new BsonDocument("$lookup",new BsonDocument
                {
                    { "from", "Projects" },
                    { "let", new BsonDocument
                        {
                            {
                                "userId",
                                new BsonDocument("$toString", "$_id")
                            }
                        }
                    },
                    { "pipeline", new BsonArray
                        {
                            // Find projects where user is a member
                            new BsonDocument("$match",
                                new BsonDocument("$expr",
                                    new BsonDocument("$in",
                                        new BsonArray
                                        {
                                            "$$userId",
                                            "$ProjectMemberId"
                                        }
                                    )
                                )
                            ),

                            // 3. Lookup Todos for each project
                            new BsonDocument("$lookup",
                                new BsonDocument
                                {
                                    { "from", "Todos" },

                                    { "let", new BsonDocument
                                        {
                                            {
                                                "projectId",
                                                new BsonDocument("$toString", "$_id")
                                            }
                                        }
                                    },

                                    { "pipeline", new BsonArray
                                        {
                                            new BsonDocument("$match",
                                                new BsonDocument("$expr",
                                                    new BsonDocument("$eq",
                                                        new BsonArray
                                                        {
                                                            "$$projectId",
                                                            "$ProjectId"
                                                        }
                                                    )
                                                )
                                            )
                                        }
                                    },

                                    { "as", "Tasks" }
                                }
                            )
                        }
                    },
                    { "as", "projects" }
                        }
                    ))
                .AppendStage<User>(new BsonDocument("$addFields",
                    new BsonDocument
                    { // Total assigned projects
                        {
                            "AssignedProjects",
                            new BsonDocument("$size", "$projects")
                        },
                // Total assigned tasks
                        {
                            "AssignedTasks",
                            new BsonDocument("$sum",
                                new BsonDocument("$map",
                                    new BsonDocument
                                    {
                                        { "input", "$projects" },
                                        { "as", "project" },
                                        {
                                            "in",
                                            new BsonDocument(
                                                "$size",
                                                "$$project.Tasks"
                                            )
                                        }
                                    }
                                )
                            )
                        },
                        // In-progress tasks
                        {
                            "InProgressTasks",
                            new BsonDocument("$sum",
                                new BsonDocument("$map",
                                    new BsonDocument
                                    {
                                        { "input", "$projects" },
                                        { "as", "project" },

                                        {
                                            "in",
                                            new BsonDocument("$size",
                                                new BsonDocument("$filter",
                                                    new BsonDocument
                                                    {
                                                        {
                                                            "input",
                                                            "$$project.Tasks"
                                                        },
                                                        {
                                                            "as",
                                                            "task"
                                                        },
                                                        {
                                                            "cond",
                                                            new BsonDocument("$eq",
                                                                new BsonArray
                                                                {
                                                                    "$$task.Status",
                                                                    1
                                                                }
                                                            )
                                                        }
                                                    }
                                                )
                                            )
                                        }
                                    }
                                )
                            )
                        },
                // Completed tasks
                {
                    "CompletedTasks",new BsonDocument("$sum",
                                new BsonDocument("$map",
                                    new BsonDocument
                                    {
                                        { "input", "$projects" },
                                        { "as", "project" },

                                        {
                                            "in",
                                            new BsonDocument("$size",
                                                new BsonDocument("$filter",
                                                    new BsonDocument
                                                    {
                                                        {
                                                            "input",
                                                            "$$project.Tasks"
                                                        },
                                                        {
                                                            "as",
                                                            "task"
                                                        },
                                                        {
                                                            "cond",
                                                            new BsonDocument("$eq",
                                                                new BsonArray
                                                                {
                                                                    "$$task.Status",
                                                                    4
                                                                }
                                                            )
                                                        }
                                                    }
                                                )
                                            )
                                        }
                                    }
                                )
                            )
                },
                    //Todo
                {
                    "TodoTasks",new BsonDocument("$sum",
                                new BsonDocument("$map",
                                    new BsonDocument
                                    {
                                        { "input", "$projects" },
                                        { "as", "project" },

                                        {
                                            "in",
                                            new BsonDocument("$size",
                                                new BsonDocument("$filter",
                                                    new BsonDocument
                                                    {
                                                        {
                                                            "input",
                                                            "$$project.Tasks"
                                                        },
                                                        {
                                                            "as",
                                                            "task"
                                                        },
                                                        {
                                                            "cond",
                                                            new BsonDocument("$eq",
                                                                new BsonArray
                                                                {
                                                                    "$$task.Status",
                                                                    0
                                                                }
                                                            )
                                                        }
                                                    }
                                                )
                                            )
                                        }
                                    }
                                )
                    )
                },
                //Review 
                {
                    "ReviewTasks",new BsonDocument("$sum",
                                new BsonDocument("$map",
                                    new BsonDocument
                                    {
                                        { "input", "$projects" },
                                        { "as", "project" },

                                        {
                                            "in",
                                            new BsonDocument("$size",
                                                new BsonDocument("$filter",
                                                    new BsonDocument
                                                    {
                                                        {
                                                            "input",
                                                            "$$project.Tasks"
                                                        },
                                                        {
                                                            "as",
                                                            "task"
                                                        },
                                                        {
                                                            "cond",
                                                            new BsonDocument("$eq",
                                                                new BsonArray
                                                                {
                                                                    "$$task.Status",
                                                                    3
                                                                }
                                                            )
                                                        }
                                                    }
                                                )
                                            )
                                        }
                                    }
                                )
                            )
                        }
                    }
                ))
                // 5. Return only required fields
                .Project(new BsonDocument
                {
                    { "_id", 0 },
                    { "AssignedProjects", 1 },
                    { "AssignedTasks", 1 },
                    { "InProgressTasks", 1 },
                    { "CompletedTasks", 1 },
                    {"TodoTasks", 1 },
                    {"ReviewTasks",1 }
                })
                .As<ProjectCountDto>()
                .FirstOrDefaultAsync();

            return result;
        }

    }

}
