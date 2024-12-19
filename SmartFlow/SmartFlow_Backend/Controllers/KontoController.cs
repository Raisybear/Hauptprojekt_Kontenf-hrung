using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SmartFlow_Backend.Models;
using SmartFlow_Backend.Repositories;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;

namespace SmartFlow_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KontoController : ControllerBase
    {
        private readonly KontoRepository _kontoRepository;

        public KontoController(KontoRepository kontoRepository)
        {
            _kontoRepository = kontoRepository;
        }

        [HttpGet("{id}", Name = "GetKonto")]
        public async Task<ActionResult<Konto>> Get(string id)
        {
            var konto = await _kontoRepository.GetKontoByIdAsync(id);
            if (konto == null)
            {
                return NotFound();
            }
            return Ok(konto);
        }

        [HttpPost]
        public async Task<ActionResult<Konto>> Create([FromBody] KontoDto kontoDto)
        {
            if (string.IsNullOrEmpty(kontoDto.Token))
            {
                return Unauthorized("Token fehlt in der Anfrage.");
            }

            try
            {
                // Token entschlüsseln
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes("my top secret key which was too short at the begining so now it ist hopefully long enough");

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                // Token validieren
                var principal = tokenHandler.ValidateToken(kontoDto.Token, validationParameters, out SecurityToken validatedToken);

                // UserId aus dem Token extrahieren
                var userId = principal.FindFirst("UserId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("UserId konnte nicht aus dem Token extrahiert werden.");
                }

                // Konto erstellen
                var konto = new Konto
                {
                    Name = kontoDto.Name,
                    Geldbetrag = kontoDto.Geldbetrag,
                    BesitzerId = userId
                };

                await _kontoRepository.CreateKontoAsync(konto);

                return CreatedAtRoute("GetKonto", new { id = konto.Id }, konto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token-Validierung fehlgeschlagen: {ex.Message}");
                return Unauthorized("Ungültiger Token.");
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Konto kontoIn)
        {
            var konto = await _kontoRepository.GetKontoByIdAsync(id);
            if (konto == null)
            {
                return NotFound();
            }

            kontoIn.Id = id;
            await _kontoRepository.UpdateKontoAsync(id, kontoIn);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var konto = await _kontoRepository.GetKontoByIdAsync(id);
            if (konto == null)
            {
                return NotFound();
            }

            await _kontoRepository.DeleteKontoAsync(id);
            return NoContent();
        }
    }
}
