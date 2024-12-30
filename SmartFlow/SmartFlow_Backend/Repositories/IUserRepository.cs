using SmartFlow_Backend.Models;
using System.Threading.Tasks;

namespace SmartFlow_Backend.Repositories
{
    public interface IUserRepository
    {
        Task CreateUserAsync(User user);
        Task<User?> GetUserByUsernameAsync(string username);
    }
}
