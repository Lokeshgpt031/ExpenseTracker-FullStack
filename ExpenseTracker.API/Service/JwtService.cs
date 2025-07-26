using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ExpenseTracker.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace ExpenseTracker.API.Service;

public interface IJwtService
{
    string GenerateToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
    int? GetUserIdFromToken(string token);
}
public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
        _secretKey = _configuration["Jwt:SecretKey"] ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!";
        _issuer = _configuration["Jwt:Issuer"] ?? "EarningTrackerApi";
        _audience = _configuration["Jwt:Audience"] ?? "EarningTrackerApp";
    }
    public string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString()),
            new("profession", user.Profession)
        };
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1), // Token valid for 7 days
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(
                                                        new SymmetricSecurityKey(key),
                                                        SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            return principal;
        }
        catch
        {
            return null;
        }
    }

    public int? GetUserIdFromToken(string token)
    {
        var principal = ValidateToken(token);
        var userIdClaim = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }

        return null;
    }
}
