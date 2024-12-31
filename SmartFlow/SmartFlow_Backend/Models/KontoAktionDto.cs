using System.ComponentModel.DataAnnotations;

namespace SmartFlow_Backend.Models
{
    public class KontoAktionDto
    {
        [Required(ErrorMessage = "Die Konto-ID ist erforderlich.")]
        public string KontoId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Die Benutzer-ID ist erforderlich.")]
        public string BenutzerId { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "Der Betrag muss größer als 0 sein.")]
        public double Betrag { get; set; }
    }
}
