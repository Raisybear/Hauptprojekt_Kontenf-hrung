using MongoDB.Driver;
using SmartFlow_Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Transactions;

namespace SmartFlow_Backend.Repositories
{
    public class TransactionsLogRepository
    {
        private readonly IMongoCollection<Transaktion> _transactionsCollection;

        public TransactionsLogRepository(IMongoClient mongoClient, IConfiguration configuration)
        {
            var database = mongoClient.GetDatabase(configuration.GetSection("MongoDbConfig:Name").Value);
            _transactionsCollection = database.GetCollection<Transaktion>("Transaktionen");
        }

        public async Task SpeichereTransaktionAsync(Transaktion transaktion)
        {
            await _transactionsCollection.InsertOneAsync(transaktion);
        }

        public async Task<List<Transaktion>> HoleTransaktionenFuerKontoAsync(string kontoId)
        {
            return await _transactionsCollection
                .Find(t => t.QuellkontoId == kontoId || t.ZielkontoId == kontoId)
                .ToListAsync();
        }
    }
}
