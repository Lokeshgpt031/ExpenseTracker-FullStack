using System;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Records;
using ExpenseTracker.API.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Service;

public interface IEarningService
{
    Task<List<EarningResponse>> GetEarningsAsync(int userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<EarningResponse?> GetEarningByIdAsync(int id, int userId);
    Task<EarningResponse> CreateEarningAsync(int userId, CreateEarningRequest request);
    Task<EarningResponse?> UpdateEarningAsync(int id, int userId, CreateEarningRequest request);
    Task<bool> DeleteEarningAsync(int id, int userId);
    Task<bool> ValidateSourceExistsAsync(int sourceId);
    Task ValidateSourceIdAsync(int sourceId);
    Task<List<SourceInfo>> GetValidSourcesAsync();
}
public class EarningService : IEarningService
{
    private readonly ExpenseTrackerDbContext _context;

    public EarningService(ExpenseTrackerDbContext context)
    {
        _context = context;
    }
    public async Task<EarningResponse> CreateEarningAsync(int userId, CreateEarningRequest request)
    {
        // Validate source if provided
        if (request.SourceId.HasValue)
        {
            await ValidateSourceIdAsync(request.SourceId.Value);
        }

        var earning = new Earning
        {
            UserId = userId,
            Date = request.Date,
            Amount = request.Amount,
            SourceId = request.SourceId,
            Type = Enum.Parse<EarningType>(request.Type, true),
            PaymentMethod = Enum.Parse<PaymentMethod>(request.PaymentMethod, true)

        };
        _context.Add(earning);
        await _context.SaveChangesAsync();
        await _context.Entry(earning).Reference(e => e.Source).LoadAsync();
        return new EarningResponse(
            earning.Id,
            earning.Date,
            earning.Amount,
            earning.Source?.Name ?? "Other",
            earning.Type.ToString(),
            earning.PaymentMethod.ToString(),
            earning.CreatedAt
        );
    }

    public async Task<bool> DeleteEarningAsync(int id, int userId)
    {
        var earning = await _context.Earnings.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (earning == null) return false;

        _context.Earnings.Remove(earning);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<EarningResponse?> GetEarningByIdAsync(int id, int userId)
    {
        var earning = await _context.Earnings
            .Include(e => e.Source)
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

        if (earning == null) return null;

        return new EarningResponse(
            earning.Id,
            earning.Date,
            earning.Amount,
            earning.Source?.Name ?? "Other",
            earning.Type.ToString(),
            earning.PaymentMethod.ToString(),
            earning.CreatedAt
        );
    }

    public async Task<List<EarningResponse>> GetEarningsAsync(int userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Earnings
                   .Include(e => e.Source)
                   .Where(e => e.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(e => DateOnly.FromDateTime(e.Date) >= DateOnly.FromDateTime(startDate.Value));

        if (endDate.HasValue)
            query = query.Where(e => DateOnly.FromDateTime(e.Date) <= DateOnly.FromDateTime(endDate.Value));

        var earnings = await query.OrderByDescending(e => e.Date).ToListAsync();

        return earnings.Select(e => new EarningResponse(
            e.Id,
            e.Date,
            e.Amount,
            e.Source?.Name ?? "Other",
            e.Type.ToString(),
            e.PaymentMethod.ToString(),
            e.CreatedAt
        )).ToList();
    }

    public async Task<EarningResponse?> UpdateEarningAsync(int id, int userId, CreateEarningRequest request)
    {
        var earning = await _context.Earnings.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (earning == null) return null;

        // Validate source if provided
        if (request.SourceId.HasValue)
        {
            await ValidateSourceIdAsync(request.SourceId.Value);
        }

        earning.Date = request.Date;
        earning.Amount = request.Amount;
        earning.SourceId = request.SourceId;
        earning.Type = Enum.Parse<EarningType>(request.Type, true);
        earning.PaymentMethod = Enum.Parse<PaymentMethod>(request.PaymentMethod, true);

        await _context.SaveChangesAsync();
        await _context.Entry(earning).Reference(e => e.Source).LoadAsync();

        return new EarningResponse(
            earning.Id,
            earning.Date,
            earning.Amount,
            earning.Source?.Name ?? "Other",
            earning.Type.ToString(),
            earning.PaymentMethod.ToString(),
            earning.CreatedAt
        );
    }

    public async Task<bool> ValidateSourceExistsAsync(int sourceId)
    {
        return await _context.Sources.AnyAsync(s => s.Id == sourceId && s.IsActive);
    }

    public async Task ValidateSourceIdAsync(int sourceId)
    {
        var sourceExists = await _context.Sources.AnyAsync(s => s.Id == sourceId && s.IsActive);
        
        if (!sourceExists)
        {
            var validSources = await GetValidSourcesAsync();
            throw new InvalidSourceException(sourceId, validSources);
        }
    }

    public async Task<List<SourceInfo>> GetValidSourcesAsync()
    {
        return await _context.Sources
            .Where(s => s.IsActive)
            .OrderBy(s => s.Name)
            .Select(s => new SourceInfo(s.Id, s.Name, s.Description))
            .ToListAsync();
    }
}
