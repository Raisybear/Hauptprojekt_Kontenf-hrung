using System.ComponentModel.DataAnnotations;

namespace SmartFlow_Backend.Models
{
    public class KontoDto
    {
        [Required(ErrorMessage = "Der Name ist erforderlich.")]
        public string Name { get; set; } = string.Empty;

        [Range(0, double.MaxValue, ErrorMessage = "Der Geldbetrag muss positiv sein.")]
        public double Geldbetrag { get; set; }

        [Required(ErrorMessage = "Das Token ist erforderlich.")]
        public string Token { get; set; } = string.Empty;
    }

}
