using MongoDB.Driver;
using SmartFlow_Backend.Models;
using System.Threading.Tasks;

namespace SmartFlow_Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserRepository(IConfiguration configuration)
        {
            var mongoClient = new MongoClient(configuration.GetSection("MongoDbConfig:ConnectionString").Value);
            var database = mongoClient.GetDatabase(configuration.GetSection("MongoDbConfig:Name").Value);
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
