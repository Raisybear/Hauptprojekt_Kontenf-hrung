using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SmartFlow_Backend.Models
{
    public class Konto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } // Nullable, damit MongoDB eine ID generieren kann
        public string Name { get; set; } = string.Empty;
        public string Besitzer { get; set; } = string.Empty;
        public decimal Geldbetrag { get; set; }
    }
}