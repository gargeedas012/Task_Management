using BackEnd.Models;
using MongoDB.Bson.Serialization.Attributes;
namespace BackEnd.DTOs
{
    public class CreateTodoDto
    {
        public string Title { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string ProjectId { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = null!;
        public DateTime DueDate { get; set; }
        public string Category { get; set; } = null!;
        public bool IsCompleted { get; set; }
    }

    public class UpdateTodoDto
    {
        public string Title { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string ProjectId { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = null!;
        public DateTime DueDate { get; set; }
        public string Category { get; set; } = null!;
        public bool IsCompleted { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class InCompleteTodoResponseDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = null!;
        public DateTime DueDate { get; set; }
        public string Category { get; set; } = null!;
        public bool IsCompleted { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class PriorityCountDto
    {
        public string Id { get; set; }
        public int Total { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class TodoByDateDto
    {
        public string Date { get; set; } = string.Empty;
        public List<Todo> Tasks { get; set; } = new();
        public long TotalTaskCount { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class TodoListResponse
    {
        public List<Todo> Todos { get; set; } = new();
        public long TotalCount { get; set; }
    }
}