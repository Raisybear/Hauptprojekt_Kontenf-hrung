using System.ComponentModel.DataAnnotations;

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

    [MaxLength(255, ErrorMessage = "Die Nachricht darf maximal 255 Zeichen lang sein.")]
    public string Nachricht { get; set; } = string.Empty;
}
