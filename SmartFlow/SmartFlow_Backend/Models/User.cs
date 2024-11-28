using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace SmartFlow_Backend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } // ID wird von MongoDB automatisch generiert

        [BsonElement("Username")]
        public string Username { get; set; } = string.Empty;

        [BsonElement("PasswordHash")]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
