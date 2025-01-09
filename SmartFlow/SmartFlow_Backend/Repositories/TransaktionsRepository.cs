using MongoDB.Driver;
using SmartFlow_Backend.Models;
using System;
using System.Threading.Tasks;

namespace SmartFlow_Backend.Repositories
{
    public class TransaktionsRepository
    {
        private readonly IKontoRepository _kontoRepository;

        public TransaktionsRepository(IKontoRepository kontoRepository)
        {
            _kontoRepository = kontoRepository;
        }

        // diese Funktion wurde mit ChatGPT erstellt
        public async Task<bool> TransferAsync(TransaktionenDto transferRequest)
        {
            // Quellkonto anhand der ID laden
            var quellkonto = await _kontoRepository.GetKontoByIdAsync(transferRequest.QuellkontoId);
            if (quellkonto == null)
            {
                throw new InvalidOperationException($"Quellkonto mit der ID {transferRequest.QuellkontoId} wurde nicht gefunden.");
            }

            // Benutzer-ID validieren
            if (quellkonto.BesitzerId != transferRequest.BenutzerId)
            {
                throw new UnauthorizedAccessException("Der Benutzer ist nicht berechtigt, auf das Quellkonto zuzugreifen.");
            }

            // Zielkonto anhand der ID laden
            var zielkonto = await _kontoRepository.GetKontoByIdAsync(transferRequest.ZielkontoId);
            if (zielkonto == null)
            {
                throw new InvalidOperationException($"Zielkonto mit der ID {transferRequest.ZielkontoId} wurde nicht gefunden.");
            }

            // Überprüfen, ob genug Guthaben vorhanden ist
            if (quellkonto.Geldbetrag < transferRequest.Betrag)
            {
                throw new InvalidOperationException("Ungenügendes Guthaben im Quellkonto.");
            }

            // Beträge anpassen
            quellkonto.Geldbetrag -= transferRequest.Betrag;
            zielkonto.Geldbetrag += transferRequest.Betrag;

            // Änderungen speichern
            await _kontoRepository.UpdateKontoAsync(quellkonto.Id, quellkonto);
            await _kontoRepository.UpdateKontoAsync(zielkonto.Id, zielkonto);

            return true;
        }
    }
}
