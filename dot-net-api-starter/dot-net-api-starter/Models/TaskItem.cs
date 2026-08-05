using Capsitech.Data.MongoDB;
using MongoDB.Bson.Serialization.Attributes;
using Projects.Data;
using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace Projects.Models
{
    [BsonIgnoreExtraElements]
    public class TaskItem : Record, IRecord
    {
        [BsonIgnoreIfNull, BsonIgnoreIfDefault]
        public string Title { get; set; }

        [BsonIgnoreIfNull, BsonIgnoreIfDefault]
        public string Description { get; set; }

        [BsonIgnoreIfNull, BsonIgnoreIfDefault]
        public bool IsCompleted { get; set; }

        [BsonIgnoreIfNull, BsonIgnoreIfDefault]
        public DateTime? DueDate { get; set; }

        [BsonIgnoreIfNull, BsonIgnoreIfDefault]
        public TaskStatusEnum Status { get; set; }
        
        [BsonIgnoreIfNull, BsonIgnoreIfDefault]
        public string AssignedTo { get; set; }
    }

    public class TaskItemDB : RecordBaseDB<TaskItem, string>
    {
        public TaskItemDB(DBConfiguration DBConfig) : base(DBConfig) { }
        public TaskItemDB(DBConfiguration DBConfig, ClaimsPrincipal user) : base(DBConfig, user) { }

        public override string CollectionName => "Tasks";
    }

    public enum TaskStatusEnum
    {
        [Display(Name = "Pending")]
        Pending = 0,

        [Display(Name = "In Progress")]
        InProgress = 1,

        [Display(Name = "Completed")]
        Completed = 2
    }
}
