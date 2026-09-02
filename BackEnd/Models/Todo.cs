using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BackEnd.Models
{
    public enum TaskStatus
    {
        Todo,
        InProgress,
        Blocked,
        Review,
        Completed
    }
    public enum TaskPriority
    {
        Low,
        Medium,
        High,
        Critical
    }
    public class TaskComment
    {
        public string Id { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Initials { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public bool IsMe { get; set; }
    }
    public class Todo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } = null!;
        public string ProjectId { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public List<string> AssignedTo { get; set; } = new();
        public string AssignedBy { get; set; } = null!;
        public TaskStatus Status { get; set; } = TaskStatus.Todo;
        public TaskPriority Priority { get; set; } = TaskPriority.Low;
        public DateTime StartDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<TaskComment>? Comments { get; set; } = new();
    }
}