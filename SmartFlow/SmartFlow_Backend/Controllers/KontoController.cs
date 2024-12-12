using Microsoft.AspNetCore.Mvc;
using SmartFlow_Backend.Models;
using SmartFlow_Backend.Repositories;
using System.Collections.Generic;
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

        [HttpGet]
        public async Task<ActionResult<List<Konto>>> Get()
        {
            var konten = await _kontoRepository.GetAllKontenAsync();
            return Ok(konten);
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
        public async Task<ActionResult<Konto>> Create(Konto konto)
        {
            // Leere ID, damit MongoDB eine neue generiert
            konto.Id = null;

            await _kontoRepository.CreateKontoAsync(konto);
            return CreatedAtRoute("GetKonto", new { id = konto.Id }, konto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Konto kontoIn)
        {
            var konto = await _kontoRepository.GetKontoByIdAsync(id);
            if (konto == null)
            {
                return NotFound();
            }

            kontoIn.Id = id; // Sicherstellen, dass die ID gleich bleibt
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
