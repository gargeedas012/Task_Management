using Capsitech.Data.Models;
using Capsitech.Data.MongoDB;
using Projects.Models;
using Projects.Dtos;
using System.Security.Claims;
using Projects.Common;
using System.Threading.Tasks;
using System;
using MongoDB.Driver;
using MongoDB.Bson;

namespace Projects.Services
{
    public class TaskService
    {
        private readonly DBConfiguration _dbConfig;

        public TaskService(DBConfiguration dbConfig)
        {
            _dbConfig = dbConfig;
        }

        public async Task<TaskItem> SaveTaskAsync(SaveTaskReq model, ClaimsPrincipal user)
        {
            if (model == null) throw new Exception("Task payload is null");
            var db = new TaskItemDB(_dbConfig, user);
            
            if (!string.IsNullOrEmpty(model.Id))
            {
                var task = await db.GetAsync(t => t.Id == model.Id);
                if (task == null) throw new Exception("Task not found");

                task.Title = model.Title;
                task.Description = model.Description;
                task.IsCompleted = model.IsCompleted;
                task.DueDate = model.DueDate;
                task.Status = model.Status;
                task.AssignedTo = model.AssignedTo;

                await db.UpdateAsync(task.Id, Builders<TaskItem>.Update
                    .Set(t => t.Title, model.Title)
                    .Set(t => t.Description, model.Description)
                    .Set(t => t.IsCompleted, model.IsCompleted)
                    .Set(t => t.DueDate, model.DueDate)
                    .Set(t => t.Status, model.Status)
                    .Set(t => t.AssignedTo, model.AssignedTo));

                return task;
            }
            else
            {
                var task = new TaskItem
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Title = model.Title,
                    Description = model.Description,
                    IsCompleted = model.IsCompleted,
                    DueDate = model.DueDate,
                    Status = model.Status,
                    AssignedTo = model.AssignedTo
                };

                await db.GetCollection().InsertOneAsync(task);
                return task;
            }
        }

        public async Task<TaskItem> GetTaskAsync(string id, ClaimsPrincipal user)
        {
            if (string.IsNullOrEmpty(id)) throw new Exception("Task ID is missing");
            var db = new TaskItemDB(_dbConfig, user);
            return await db.GetAsync(t => t.Id == id);
        }

        public async Task<PagedData<TaskItem>> GetTaskListAsync(TaskSearchReq model, ClaimsPrincipal user)
        {
            var db = new TaskItemDB(_dbConfig, user);
            var filterBuilder = Builders<TaskItem>.Filter;
            var filter = filterBuilder.Empty;

            if (model.Status.HasValue)
            {
                filter &= filterBuilder.Eq(t => t.Status, model.Status.Value);
            }
            
            if (!string.IsNullOrEmpty(model.Term))
            {
                var regex = new BsonRegularExpression(model.Term, "i");
                filter &= filterBuilder.Or(
                    filterBuilder.Regex(t => t.Title, regex),
                    filterBuilder.Regex(t => t.Description, regex)
                );
            }

            var qry = db.GetCollection().Find(filter);
            var total = await qry.CountDocumentsAsync();
            
            var items = await qry
                .Skip(model.Start)
                .Limit(model.Length)
                .ToListAsync();

            return new PagedData<TaskItem>
            {
                TotalRecords = (int)total,
                Items = items
            };
        }

        public async Task<bool> DeleteTaskAsync(string id, ClaimsPrincipal user)
        {
            if (string.IsNullOrEmpty(id)) throw new Exception("Task ID is missing");
            var db = new TaskItemDB(_dbConfig, user);
            return await db.DeleteAsync(id);
        }
    }
}
