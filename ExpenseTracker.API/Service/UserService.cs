using System;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Records;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Service;

public interface IUserService
{
    Task<AuthResponse?> LoginAsync(LoginRequest loginRequest);
    Task<AuthResponse?> RegisterAsync(RegisterRequest registerRequest);
    Task<UserResponse?> GetUserByIdAsync(int userId);
    Task<UserResponse?> UpdateUserAsync(int userId, UpdateUserRequest updateRequest);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest changePasswordRequest);
    Task<bool> DeleteUserAsync(int userId);
    Task<List<UserResponse>> GetAllUsersAsync();
}
public class UserService : IUserService
{
    private readonly ExpenseTrackerDbContext _context;
    private readonly IJwtService _jwtService;

    public UserService(ExpenseTrackerDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }
    public async Task<AuthResponse?> LoginAsync(LoginRequest loginRequest)
    {
        var user = await _context.Users
                    .FirstOrDefaultAsync(a => a.Email.ToLower() == loginRequest.Email.ToLower() && a.IsActive);
        if (user == null || BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
        {
            return null;
        }
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return GetAuthResponse(user);

    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest registerRequest)
    {
        if (await _context.Users.AnyAsync(a => a.Email.ToLower() == registerRequest.Email.ToLower()))
        {
            return null;
        }
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password);
        User user = new User
        {
            Name = registerRequest.Name,
            Email = registerRequest.Email.ToLower(),
            PhoneNumber = registerRequest.PhoneNumber,
            PasswordHash = passwordHash,
            Role = UserRole.DailyEarner,
            Profession = registerRequest.Profession,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return GetAuthResponse(user);
    }
    protected AuthResponse GetAuthResponse(User user)
    {
        var token = _jwtService.GenerateToken(user);

        return new AuthResponse(
            token,
            MapToUserResponse(user),
            DateTime.UtcNow.AddDays(7)
        );
    }
    public async Task<UserResponse?> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null || !user.IsActive)
        {
            return null;
        }
        return MapToUserResponse(user);
    }

    public async Task<UserResponse?> UpdateUserAsync(int userId, UpdateUserRequest updateRequest)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

        if (user == null) return null;

        user.Name = updateRequest.Name;
        user.PhoneNumber = updateRequest.PhoneNumber;
        user.Profession = updateRequest.Profession;

        await _context.SaveChangesAsync();

        return MapToUserResponse(user);
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest changePasswordRequest)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

        if (user == null || !BCrypt.Net.BCrypt.Verify(changePasswordRequest.CurrentPassword, user.PasswordHash))
        {
            return false;
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordRequest.NewPassword);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteUserAsync(int userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return false;

        user.IsActive = false; // Soft delete
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<UserResponse>> GetAllUsersAsync()
    {
        var users = await _context.Users
            .Where(u => u.IsActive)
            .OrderBy(u => u.Name)
            .ToListAsync();

        return users.Select(MapToUserResponse).ToList();
    }

    private static UserResponse MapToUserResponse(User user)
    {
        return new UserResponse(
            user.Id,
            user.Name,
            user.Email,
            user.PhoneNumber,
            user.Profession,
            user.CreatedAt
        );
    }

}
