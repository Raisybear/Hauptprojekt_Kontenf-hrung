using Microsoft.AspNetCore.Mvc;
using SmartFlow_Backend.Models;
using SmartFlow_Backend.Repositories;
using System;
using System.Threading.Tasks;

namespace SmartFlow_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransaktionsController : ControllerBase
    {
        private readonly TransaktionsRepository _transaktionsRepository;

        public TransaktionsController(TransaktionsRepository transaktionsRepository)
        {
            _transaktionsRepository = transaktionsRepository;
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
    }
}
