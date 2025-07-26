using System;
using System.Security.Claims;

namespace ExpenseTracker.API.Extensions;

public static class ControllerExtensions
{
 public static int? GetCurrentUserId(this ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }
        return null;
    }

    public static string? GetCurrentUserEmail(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Email)?.Value;
    }

    public static string? GetCurrentUserRole(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Role)?.Value;
    }
}
