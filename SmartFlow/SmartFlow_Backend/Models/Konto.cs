using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SmartFlow_Backend.Models
{
    public class Konto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? BesitzerId { get; set; }

        public string Name { get; set; } = string.Empty;

        public double Geldbetrag { get; set; }
    }
}