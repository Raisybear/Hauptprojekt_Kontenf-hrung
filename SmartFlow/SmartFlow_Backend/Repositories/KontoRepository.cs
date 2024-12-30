using MongoDB.Driver;
using SmartFlow_Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartFlow_Backend.Repositories
{
    public class KontoRepository : IKontoRepository
    {
        private readonly IMongoCollection<Konto> _kontenCollection;

        public KontoRepository(IConfiguration configuration)
        {
            var mongoClient = new MongoClient(configuration.GetSection("MongoDbConfig:ConnectionString").Value);
            var database = mongoClient.GetDatabase(configuration.GetSection("MongoDbConfig:Name").Value);
            _kontenCollection = database.GetCollection<Konto>("Konten");
        }

        public async Task CreateKontoAsync(Konto konto)
        {
            await _kontenCollection.InsertOneAsync(konto);
        }

        public async Task<Konto?> GetKontoByIdAsync(string id)
        {
            return await _kontenCollection.Find(k => k.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Konto>> GetKontenByUserIdAsync(string userId)
        {
            return await _kontenCollection.Find(k => k.BesitzerId == userId).ToListAsync();
        }

        public async Task<List<Konto>> GetAllKontenAsync()
        {
            return await _kontenCollection.Find(k => true).ToListAsync();
        }

        public async Task UpdateKontoAsync(string id, Konto kontoIn)
        {
            await _kontenCollection.ReplaceOneAsync(k => k.Id == id, kontoIn);
        }

        public async Task DeleteKontoAsync(string id)
        {
            await _kontenCollection.DeleteOneAsync(k => k.Id == id);
        }
    }
}
