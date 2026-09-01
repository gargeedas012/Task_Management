using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BackEnd.Models
{
    public enum ProjectStatus
    {
        NotStarted,
        InProgress,
        OnHold,
        Completed
    }
    public enum ProjectPriority
    {
        Low,
        Medium,
        High,
        Critical
    }
    public class Project
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string ProjectManagerId { get; set; } = null!;
        public string Client {  get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string> ProjectMemberId { get; set; } = new();

        [BsonRepresentation(BsonType.String)]
        public ProjectStatus Status { get; set; } = ProjectStatus.NotStarted;

        [BsonRepresentation(BsonType.String)]
        public ProjectPriority Priority { get; set; } = ProjectPriority.Low;
        public int? TotalTasks { get; set; }
        public int? CompletedTasks { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}