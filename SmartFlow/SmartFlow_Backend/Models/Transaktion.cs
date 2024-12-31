using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SmartFlow_Backend.Models
{
    public class Transaktion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string QuellkontoId { get; set; } = string.Empty;
        public string ZielkontoId { get; set; } = string.Empty;
        public string BenutzerId { get; set; } = string.Empty;
        public double Betrag { get; set; }
        public string Nachricht { get; set; } = string.Empty;
        public DateTime Erstellungsdatum { get; set; } = DateTime.UtcNow;
    }
}
