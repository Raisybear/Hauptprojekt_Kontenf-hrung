using Microsoft.AspNetCore.Mvc;
using SmartFlow_Backend.Models;
using SmartFlow_Backend.Repositories;
using System;
using System.Threading.Tasks;
using System.Transactions;

namespace SmartFlow_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransaktionenController : ControllerBase
    {
        private readonly TransaktionsRepository _transaktionsRepository;
        private readonly TransactionsLogRepository _transactionsLogRepository;
        private readonly IKontoRepository _kontoRepository;

        public TransaktionenController(
            TransaktionsRepository transaktionsRepository,
            TransactionsLogRepository transactionsLogRepository,
            IKontoRepository kontoRepository)
        {
            _transaktionsRepository = transaktionsRepository;
            _transactionsLogRepository = transactionsLogRepository;
            _kontoRepository = kontoRepository;
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransaktionenDto transferRequest)
        {
            if (transferRequest.Betrag <= 0)
            {
                return BadRequest("Der Betrag muss positiv sein.");
            }

            try
            {
                await _transaktionsRepository.TransferAsync(transferRequest);

                // Transaktionsdetails speichern
                var transaktion = new Transaktion
                {
                    QuellkontoId = transferRequest.QuellkontoId,
                    ZielkontoId = transferRequest.ZielkontoId,
                    BenutzerId = transferRequest.BenutzerId,
                    Betrag = transferRequest.Betrag,
                    Nachricht = transferRequest.Nachricht,
                    Erstellungsdatum = DateTime.UtcNow
                };

                await _transactionsLogRepository.SpeichereTransaktionAsync(transaktion);

                return Ok(new { Nachricht = "Überweisung erfolgreich." });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fehler bei der Überweisung: {ex.Message}");
                return StatusCode(500, "Ein Fehler ist während der Überweisung aufgetreten.");
            }
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit([FromBody] KontoAktionDto transaktionRequest)
        {
            if (transaktionRequest.Betrag <= 0)
            {
                return BadRequest("Der Betrag muss positiv sein.");
            }

            try
            {
                var konto = await _kontoRepository.GetKontoByIdAsync(transaktionRequest.KontoId);
                if (konto == null)
                {
                    return NotFound($"Konto mit der ID {transaktionRequest.KontoId} wurde nicht gefunden.");
                }

                if (konto.BesitzerId != transaktionRequest.BenutzerId)
                {
                    return Unauthorized("Sie sind nicht berechtigt, auf dieses Konto zuzugreifen.");
                }

                konto.Geldbetrag += transaktionRequest.Betrag;
                await _kontoRepository.UpdateKontoAsync(konto.Id, konto);

                return Ok(new { Nachricht = "Einzahlung erfolgreich.", NeuerBetrag = konto.Geldbetrag });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fehler bei der Einzahlung: {ex.Message}");
                return StatusCode(500, "Ein Fehler ist während der Einzahlung aufgetreten.");
            }
        }

        [HttpPost("withdraw")]
        public async Task<IActionResult> Withdraw([FromBody] KontoAktionDto transaktionRequest)
        {
            if (transaktionRequest.Betrag <= 0)
            {
                return BadRequest("Der Betrag muss positiv sein.");
            }

            try
            {
                var konto = await _kontoRepository.GetKontoByIdAsync(transaktionRequest.KontoId);
                if (konto == null)
                {
                    return NotFound($"Konto mit der ID {transaktionRequest.KontoId} wurde nicht gefunden.");
                }

                if (konto.BesitzerId != transaktionRequest.BenutzerId)
                {
                    return Unauthorized("Sie sind nicht berechtigt, auf dieses Konto zuzugreifen.");
                }

                if (konto.Geldbetrag < transaktionRequest.Betrag)
                {
                    return BadRequest("Unzureichender Kontostand.");
                }

                konto.Geldbetrag -= transaktionRequest.Betrag;
                await _kontoRepository.UpdateKontoAsync(konto.Id, konto);

                return Ok(new { Nachricht = "Abhebung erfolgreich.", NeuerBetrag = konto.Geldbetrag });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fehler bei der Abhebung: {ex.Message}");
                return StatusCode(500, "Ein Fehler ist während der Abhebung aufgetreten.");
            }
        }

        [HttpGet("transactions/{kontoId}")]
        public async Task<IActionResult> GetTransactionsForAccount(string kontoId)
        {
            try
            {
                var transaktionen = await _transactionsLogRepository.HoleTransaktionenFuerKontoAsync(kontoId);
                return Ok(transaktionen);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fehler beim Abrufen der Transaktionen: {ex.Message}");
                return StatusCode(500, "Ein Fehler ist während des Abrufs der Transaktionen aufgetreten.");
            }
        }
    }
}
