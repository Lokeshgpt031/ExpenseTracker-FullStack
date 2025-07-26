using ExpenseTracker.API.Extensions;
using ExpenseTracker.API.Records;
using ExpenseTracker.API.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {
          private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("overview")]
    public async Task<ActionResult<AnalyticsResponse>> GetAnalytics(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var analytics = await _analyticsService.GetAnalyticsAsync(userId.Value, startDate, endDate);
        return Ok(analytics);
    }

    [HttpGet("daily-summary")]
    public async Task<ActionResult<List<DailySummaryResponse>>> GetDailySummary(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var start = startDate ?? DateTime.Today.AddDays(-30);
        var end = endDate ?? DateTime.Today;
        
        var summary = await _analyticsService.GetDailySummaryAsync(userId.Value, start, end);
        return Ok(summary);
    }

    [HttpGet("weekly-trends")]
    public async Task<ActionResult<List<TrendDataResponse>>> GetWeeklyTrends([FromQuery] int weeks = 12)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var trends = await _analyticsService.GetWeeklyTrendsAsync(userId.Value, weeks);
        return Ok(trends);
    }

    [HttpGet("monthly-trends")]
    public async Task<ActionResult<List<TrendDataResponse>>> GetMonthlyTrends([FromQuery] int months = 12)
    {
        var userId = User.GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var trends = await _analyticsService.GetMonthlyTrendsAsync(userId.Value, months);
        return Ok(trends);
    }
    }
}
