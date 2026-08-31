using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BackEnd.DTOs
{
    public class ProjectCountDto
    {
        [BsonElement("TotalProjects")]
        public int TotalProjects { get; set; }

        [BsonElement("ActiveProjects")]
        public int ActiveProjects { get; set; }

        [BsonElement("TotalTasks")]
        public int TotalTasks { get; set; }

        [BsonElement("CompletedTask")]
        public int CompletedTask { get; set; }
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
