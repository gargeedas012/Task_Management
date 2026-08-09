using MongoDB.Bson.Serialization.Attributes;

namespace BackEnd.DTOs
{
    [BsonIgnoreExtraElements]
    public class PriorityCountDto
    {
        public string Id { get; set; }
        public int Total { get; set; }
    }
}
