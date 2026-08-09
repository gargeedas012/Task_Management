using BackEnd.DTOs;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace BackEnd.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public List<RefreshTokenResponseDto> RefreshTokens { get; set; } = new();
    }
}
