using ExpenseTracker.API.Extensions;
using ExpenseTracker.API.Records;
using ExpenseTracker.API.Service;
using ExpenseTracker.API.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EarningsController : ControllerBase
{
    private readonly IEarningService _earningService;

    public EarningsController(IEarningService earningService)
    {
        _earningService = earningService;
    }
      [HttpGet]
    public async Task<ActionResult<List<EarningResponse>>> GetEarnings(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var earnings = await _earningService.GetEarningsAsync(userId.Value, startDate, endDate);
        return Ok(earnings);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EarningResponse>> GetEarning(int id)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var earning = await _earningService.GetEarningByIdAsync(id, userId.Value);
        if (earning == null)
            return NotFound();

        return Ok(earning);
    }

    [HttpPost]
    public async Task<ActionResult<EarningResponse>> CreateEarning( CreateEarningRequest request)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null) return Unauthorized();

        // Validate enum values
        if (!EnumValidationExtensions.IsValidEarningType(request.Type))
        {
            return BadRequest($"Invalid earning type. Valid values are: {string.Join(", ", EnumValidationExtensions.GetEnumDisplayNames<Models.EarningType>().Select(x => $"{x.Key}:{x.Value}"))}");
        }

        if (!EnumValidationExtensions.IsValidPaymentMethod(request.PaymentMethod))
        {
            return BadRequest($"Invalid payment method. Valid values are: {string.Join(", ", EnumValidationExtensions.GetEnumDisplayNames<Models.PaymentMethod>().Select(x => $"{x.Key}:{x.Value}"))}");
        }

        try
        {
            var earning = await _earningService.CreateEarningAsync(userId.Value, request);
            return CreatedAtAction(nameof(GetEarning), new { id = earning.Id }, earning);
        }
        catch (InvalidSourceException ex)
        {
            return BadRequest(new
            {
                error = ex.Message,
                invalidSourceId = ex.InvalidSourceId,
                validSources = ex.ValidSources.Select(s => new { s.Id, s.Name, s.Description })
            });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<EarningResponse>> UpdateEarning(int id,CreateEarningRequest request)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null) return Unauthorized();

        // Validate enum values
        if (!EnumValidationExtensions.IsValidEarningType(request.Type))
        {
            return BadRequest($"Invalid earning type. Valid values are: {string.Join(", ", EnumValidationExtensions.GetEnumDisplayNames<Models.EarningType>().Select(x => $"{x.Key}:{x.Value}"))}");
        }

        if (!EnumValidationExtensions.IsValidPaymentMethod(request.PaymentMethod))
        {
            return BadRequest($"Invalid payment method. Valid values are: {string.Join(", ", EnumValidationExtensions.GetEnumDisplayNames<Models.PaymentMethod>().Select(x => $"{x.Key}:{x.Value}"))}");
        }

        try
        {
            var earning = await _earningService.UpdateEarningAsync(id, userId.Value, request);
            if (earning == null)
                return NotFound();

            return Ok(earning);
        }
        catch (InvalidSourceException ex)
        {
            return BadRequest(new
            {
                error = ex.Message,
                invalidSourceId = ex.InvalidSourceId,
                validSources = ex.ValidSources.Select(s => new { s.Id, s.Name, s.Description })
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEarning(int id)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var result = await _earningService.DeleteEarningAsync(id, userId.Value);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("sources")]
    public async Task<ActionResult<List<SourceInfo>>> GetValidSources()
    {
        var sources = await _earningService.GetValidSourcesAsync();
        return Ok(sources);
    }
}
