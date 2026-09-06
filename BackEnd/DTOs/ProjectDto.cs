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

        [BsonElement("TodoTasks")]
        public int TodoTasks { get; set; }

        [BsonElement("ReviewTasks")]
        public int ReviewTasks { get; set; }
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
    public class ProjectInfoDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }

        public int InProgressTasks { get; set; }
        public int TodoTasks { get; set; }
        public int ReviewTasks { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<string> Members { get; set; } = new();
    }

    public class ProjectIdNameInfo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }= string.Empty;
        public string Name { get; set; }= string.Empty;
    }
    public class TeamMemberDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
    }
}
