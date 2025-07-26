using System.Security.Claims;
using ExpenseTracker.API.Records;
using ExpenseTracker.API.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _userService.LoginAsync(loginRequest);
            if (response == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest registerRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _userService.RegisterAsync(registerRequest);
            if (response == null)
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            return CreatedAtAction(nameof(Login), null, response);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserResponse>> GetCurrentUser()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userService.GetUserByIdAsync(userId.Value);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<ActionResult<UserResponse>> UpdateCurrentUser([FromBody] UpdateUserRequest updateRequest)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userService.UpdateUserAsync(userId.Value, updateRequest);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest changePasswordRequest)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _userService.ChangePasswordAsync(userId.Value, changePasswordRequest);
            if (!result)
            {
                return BadRequest(new { message = "Invalid current password" });
            }

            return Ok(new { message = "Password changed successfully" });
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            return null;
        }
    }
}
