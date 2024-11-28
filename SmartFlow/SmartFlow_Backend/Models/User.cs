using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace SmartFlow_Backend.Models
{
    public class User
    {
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
    }
}
