using MongoDB.Bson.Serialization.Attributes;

namespace BackEnd.DTOs
{
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
}
