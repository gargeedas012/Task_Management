using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BackEnd.DTOs
{
    public class ProjectCountDto
    {
        [BsonElement("AssignedProjects")]
        public int AssignedProjects { get; set; }

        [BsonElement("AssignedTasks")]
        public int AssignedTasks { get; set; }

        [BsonElement("InProgressTasks")]
        public int InProgressTasks { get; set; }

        [BsonElement("CompletedTasks")]
        public int CompletedTasks { get; set; }
    }
    public class ProjectResponseDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string UserId { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string Status { get; set; } = "Active";

        public int TotalTask { get; set; }
        public int CompletedTask { get; set; }
        public string ProjectDueDate { get; set; } = null!;
    }
}
