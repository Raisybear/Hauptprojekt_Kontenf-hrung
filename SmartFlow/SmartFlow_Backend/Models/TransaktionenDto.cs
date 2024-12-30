using System.ComponentModel.DataAnnotations;

namespace SmartFlow_Backend.Models
{
    public class TransaktionenDto
    {
        [Required(ErrorMessage = "Die Quellkonto-ID ist erforderlich.")]
        public string QuellkontoId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Die Zielkonto-ID ist erforderlich.")]
        public string ZielkontoId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Die Benutzer-ID ist erforderlich.")]
        public string BenutzerId { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "Der Betrag muss größer als 0 sein.")]
        public double Betrag { get; set; }
    }
}
