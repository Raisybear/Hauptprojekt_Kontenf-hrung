using MongoDB.Driver;
using SmartFlow_Backend.Models;

namespace SmartFlow_Backend.Repositories
{
    public class UserRepository
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserRepository(IConfiguration configuration)
        {
            // MongoClient mit Connectionstring
            var mongoClient = new MongoClient(configuration.GetSection("MongoDbConfig:ConnectionString").Value);
            var database = mongoClient.GetDatabase(configuration.GetSection("MongoDbConfig:Name").Value);

            // Sammlung "Users" initialisieren
            _usersCollection = database.GetCollection<User>("Users");
        }

        public async Task CreateUserAsync(User user)
        {
            await _usersCollection.InsertOneAsync(user);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
        }
    }
}
