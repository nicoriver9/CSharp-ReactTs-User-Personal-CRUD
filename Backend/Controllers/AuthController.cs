using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel login)
    {
        var user = _context.Users.SingleOrDefault(u => u.Username == login.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash) || !user.IsActive)
        {
            return Unauthorized();
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return Ok(new
        {
            Id = user.id,
            Username = user.Username,
            //FirstName = user.FirstName,
            //LastName = user.LastName,
            Token = tokenString,
            Role = user.Role
        });
    }

    [Authorize(Roles = "admin")]
    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterModel register)
    {
        var userExists = _context.Users.Any(u => u.Username == register.Username);
        if (userExists)
        {
            return BadRequest("User already exists");
        }

        var user = new User
        {
            Username = register.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password),
            Role = string.IsNullOrEmpty(register.Role) ? "user" : register.Role, // Asigna el rol, valor por defecto "user"
            IsActive = true
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok();
    }

    [Authorize(Roles = "admin")]
    [HttpPost("deactivate/{userId}")]
    public IActionResult DeactivateUser(int userId)
    {
        var user = _context.Users.FirstOrDefault(u => u.id == userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        user.IsActive = false;
        _context.SaveChanges();

        return Ok($"User with ID {userId} has been deactivated");
    }

    [Authorize(Roles = "admin")]
    [HttpPost("activate/{userId}")]
    public IActionResult ActivateUser(int userId)
    {
        var user = _context.Users.FirstOrDefault(u => u.id == userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        user.IsActive = true;
        _context.SaveChanges();

        return Ok($"User with ID {userId} has been activated");
    }

    [Authorize(Roles = "admin")]
    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        var users = _context.Users.Select(user => new
        {
            user.id,
            user.Username,
            user.IsActive,
            user.Role
        }).ToList();

        return Ok(users);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("active-users")]
    public IActionResult GetActiveUsers()
    {
        var users = _context.Users
            .Where(user => user.IsActive)
            .Select(user => new
            {
                user.id,
                user.Username,
                user.IsActive
            }).ToList();

        return Ok(users);
    }

    [Authorize(Roles = "admin")]
    [HttpPut("update-role/{userId}")]
    public IActionResult UpdateUserRole(int userId, [FromBody] UpdateRoleModel model)
    {
        var user = _context.Users.Find(userId);
        if (user == null)
        {
            return NotFound();
        }

        user.Role = model.Role;
        _context.SaveChanges();

        return NoContent();
    }

}

public class RegisterModel
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "user"; 
}

public class LoginModel
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UpdateRoleModel
{
    public string Role { get; set; } = "user";
}