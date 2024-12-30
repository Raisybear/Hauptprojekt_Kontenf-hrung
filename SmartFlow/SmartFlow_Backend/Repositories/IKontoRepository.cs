using SmartFlow_Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartFlow_Backend.Repositories
{
    public interface IKontoRepository
    {
        Task CreateKontoAsync(Konto konto);
        Task<Konto?> GetKontoByIdAsync(string id);
        Task<List<Konto>> GetKontenByUserIdAsync(string userId);
        Task<List<Konto>> GetAllKontenAsync();
        Task UpdateKontoAsync(string id, Konto kontoIn);
        Task DeleteKontoAsync(string id);
    }
}
