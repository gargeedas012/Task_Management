using BackEnd.Models;
using MongoDB.Bson;
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
        public TaskPriority Priority { get; set; }
        public int Count { get; set; }
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

    public class TodoResponse
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } = null!;
        public string Title { get; set; }=string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } 
        public string TodoDueDate { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }=false;
        public string Priority { get; set; } = null!;
        public string ProjectName { get; set; } = string.Empty;
    }

    public class TaskInfoDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ProjectName { get; set; }
        public int Status { get; set; }
        public int Priority { get; set; }
        public DateTime DueDate { get; set; }
    }

    public class TaskDashboardDto
    {
        public List<TaskInfoDto> TodayTasks { get; set; } = new();
        public List<TaskInfoDto> UpcomingTasks { get; set; } = new();
    }

    public class WeeklyActivityDto
    {
        [BsonElement("week")]
        public string Week { get; set; } = string.Empty;
        [BsonElement("started")]
        public int Started { get; set; }
        [BsonElement("completed")]
        public int Completed { get; set; }
    }



}