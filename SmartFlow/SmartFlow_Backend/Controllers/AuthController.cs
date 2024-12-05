using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SmartFlow_Backend.Models;
using SmartFlow_Backend.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartFlow_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserRepository _userRepository;

        public AuthController(IConfiguration configuration, UserRepository userRepository)
        {
            _configuration = configuration;
            _userRepository = userRepository;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            // Überprüfen, ob Benutzer bereits existiert
            var existingUser = await _userRepository.GetUserByUsernameAsync(request.Username);
            if (existingUser != null)
            {
                return BadRequest("User already exists.");
            }

            // Passwort-Hash generieren
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Neuen Benutzer erstellen
            var newUser = new User
            {
                Username = request.Username,
                PasswordHash = passwordHash
            };

            // Benutzer speichern
            await _userRepository.CreateUserAsync(newUser);

            return Ok(newUser);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            // Benutzer anhand des Benutzernamens finden
            var user = await _userRepository.GetUserByUsernameAsync(request.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest("User or Password incorrect.");
            }

            // JWT-Token generieren
            string token = GenerateJwtToken(user);

            return Ok(token);
        }

        private string GenerateJwtToken(User user)
        {
            // Ansprüche für den Token definieren
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username)
            };

            // Schlüssel aus der Konfiguration abrufen
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("Appsettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddSeconds(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
