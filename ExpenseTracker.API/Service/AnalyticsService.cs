using System;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Records;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Service;

public interface IAnalyticsService
{
    Task<AnalyticsResponse> GetAnalyticsAsync(int userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<List<DailySummaryResponse>> GetDailySummaryAsync(int userId, DateTime startDate, DateTime endDate);
    Task<List<TrendDataResponse>> GetWeeklyTrendsAsync(int userId, int weeks = 12);
    Task<List<TrendDataResponse>> GetMonthlyTrendsAsync(int userId, int months = 12);
}
public class AnalyticsService : IAnalyticsService
{
    private readonly ExpenseTrackerDbContext _context;

    public AnalyticsService(ExpenseTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<AnalyticsResponse> GetAnalyticsAsync(int userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        
        var start = startDate ?? DateTime.Today.AddDays(-30);
        var end = endDate ?? DateTime.Today.AddDays(1);

        var earnings = await _context.Earnings
            .Include(e => e.Source)
            .Where(e => e.UserId == userId && e.Date.Date >= start.Date && e.Date.Date <= end.Date)
            .ToListAsync();

        var expenses = await _context.Expenses
            .Where(e => e.UserId == userId && e.Date.Date >= start.Date && e.Date.Date <= end.Date)
            .ToListAsync();

        var totalEarnings = earnings.Sum(e => e.Amount);
        var totalExpenses = expenses.Sum(e => e.Amount);
        var days = (end - start).Days + 1;

        var earningsBySource = earnings
            .GroupBy(e => e.Source?.Name ?? "Other")
            .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

        var expensesByCategory = expenses
            .AsEnumerable() // Force evaluation in memory
            .GroupBy(e => e.Category.ToString())
            .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));

        var weeklyTrends = await GetWeeklyTrendsAsync(userId, 12);
        var monthlyTrends = await GetMonthlyTrendsAsync(userId, 6);

        return new AnalyticsResponse(
            totalEarnings,
            totalExpenses,
            totalEarnings - totalExpenses,
            days > 0 ? totalEarnings / days : 0,
            days > 0 ? totalExpenses / days : 0,
            earningsBySource,
            expensesByCategory,
            weeklyTrends,
            monthlyTrends
        );
    }

    public async Task<List<DailySummaryResponse>> GetDailySummaryAsync(int userId, DateTime startDate, DateTime endDate)
    {
        var allEarnings = await _context.Earnings.Where(
              u => u.UserId == userId
          && u.Date.Date >= startDate.Date
          && u.Date.Date <= endDate.Date)
          .ToListAsync();
        var allExpenses = await _context.Expenses.Where(
            u => u.UserId == userId
            && u.Date.Date >= startDate.Date
            && u.Date.Date <= endDate.Date
        ).ToListAsync();

        var earnings = allEarnings.GroupBy(u => u.Date.Date)
        .Select(g => new
        {
            Date = g.Key,
            TotalEarnings = g.Sum(e => e.Amount),
            Count = g.Count()

        }).ToList();

        var expenses = allExpenses.GroupBy(u => u.Date.Date)
        .Select(g => new
        {
            Date = g.Key,
            TotalEarnings = g.Sum(e => e.Amount),
            Count = g.Count()

        }).ToList();
        var summary = new List<DailySummaryResponse>();
        for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
        {
            var earning = earnings.FirstOrDefault(a => a.Date == date);
            var expense = expenses.FirstOrDefault(a => a.Date == date);
            var totalEarnings = earning?.TotalEarnings ?? 0;
            var totalExpenses = expense?.TotalEarnings ?? 0;

            summary.Add(new DailySummaryResponse(
            date,
            totalEarnings,
            totalExpenses,
            totalEarnings - totalExpenses,
            earning?.Count ?? 0,
            expense?.Count ?? 0
        ));
        }
        return summary;

    }

    public async Task<List<TrendDataResponse>> GetMonthlyTrendsAsync(int userId, int months = 12)
    {
        var today = DateTime.Today;
        var startDate = new DateTime(today.Year, today.Month, 1).AddMonths(-(months - 1));
        var endDate = new DateTime(today.Year, today.Month, 1).AddMonths(1).AddDays(-1);

        // Fetch all data in single queries
        var earnings = await _context.Earnings
            .Where(e => e.UserId == userId && e.Date >= startDate && e.Date <= endDate)
            .ToListAsync();

        var expenses = await _context.Expenses
            .Where(e => e.UserId == userId && e.Date >= startDate && e.Date <= endDate)
            .ToListAsync();

        var trends = new List<TrendDataResponse>();

        for (int i = months - 1; i >= 0; i--)
        {
            var monthStart = new DateTime(today.Year, today.Month, 1).AddMonths(-i);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var monthlyEarnings = earnings
                .Where(e => e.Date >= monthStart && e.Date <= monthEnd)
                .Sum(e => e.Amount);

            var monthlyExpenses = expenses
                .Where(e => e.Date >= monthStart && e.Date <= monthEnd)
                .Sum(e => e.Amount);

            trends.Add(new TrendDataResponse(
                monthStart,
                monthlyEarnings,
                monthlyExpenses,
                monthlyEarnings - monthlyExpenses
            ));
        }

        return trends; 
    }

    public async Task<List<TrendDataResponse>> GetWeeklyTrendsAsync(int userId, int weeks = 12)
    {
        var today = DateTime.Today;
        var startDate = today.AddDays(-(int)today.DayOfWeek - ((weeks - 1) * 7));
        var endDate = today.AddDays(6 - (int)today.DayOfWeek);

        // Fetch all data in single queries
        var earnings = await _context.Earnings
            .Where(e => e.UserId == userId && e.Date >= startDate && e.Date <= endDate)
            .ToListAsync();

        var expenses = await _context.Expenses
            .Where(e => e.UserId == userId && e.Date >= startDate && e.Date <= endDate)
            .ToListAsync();

        var trends = new List<TrendDataResponse>();

        for (int i = weeks - 1; i >= 0; i--)
        {
            var weekStart = today.AddDays(-(int)today.DayOfWeek - (i * 7));
            var weekEnd = weekStart.AddDays(6);

            var weeklyEarnings = earnings
                .Where(e => e.Date >= weekStart && e.Date <= weekEnd)
                .Sum(e => e.Amount);

            var weeklyExpenses = expenses
                .Where(e => e.Date >= weekStart && e.Date <= weekEnd)
                .Sum(e => e.Amount);

            trends.Add(new TrendDataResponse(
                weekStart,
                weeklyEarnings,
                weeklyExpenses,
                weeklyEarnings - weeklyExpenses
            ));
        }

        return trends;
    }
}
