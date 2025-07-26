using System;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Records;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Service;

public interface IExpenseService
{
    Task<List<ExpenseResponse>> GetExpensesAsync(int userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<ExpenseResponse?> GetExpenseByIdAsync(int id, int userId);
    Task<ExpenseResponse> CreateExpenseAsync(int userId, CreateExpenseRequest request);
    Task<ExpenseResponse?> UpdateExpenseAsync(int id, int userId, CreateExpenseRequest request);
    Task<bool> DeleteExpenseAsync(int id, int userId);
}
public class ExpenseService : IExpenseService
{
    private readonly ExpenseTrackerDbContext _context;

    public ExpenseService(ExpenseTrackerDbContext context)
    {
        _context = context;
    }
    public async Task<List<ExpenseResponse>> GetExpensesAsync(int userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Expenses.Where(e => e.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(e => e.Date >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(e => e.Date <= endDate.Value);

        var expenses = await query.OrderByDescending(e => e.Date).ToListAsync();

        return expenses.Select(e => new ExpenseResponse(
            e.Id,
            e.Date,
            e.Amount,
            e.Category.ToString(),
            e.PaymentMethod.ToString(),
            e.CreatedAt
        )).ToList();
    }

    public async Task<ExpenseResponse?> GetExpenseByIdAsync(int id, int userId)
    {
        var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (expense == null) return null;

        return new ExpenseResponse(
            expense.Id,
            expense.Date,
            expense.Amount,
            expense.Category.ToString(),
            expense.PaymentMethod.ToString(),
            expense.CreatedAt
        );
    }

    public async Task<ExpenseResponse> CreateExpenseAsync(int userId, CreateExpenseRequest request)
    {
        var expense = new Expense
        {
            UserId = userId,
            Date = request.Date,
            Amount = request.Amount,
            Category = Enum.Parse<ExpenseCategory>(request.Category, true),
            PaymentMethod = Enum.Parse<PaymentMethod>(request.PaymentMethod, true),
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return new ExpenseResponse(
            expense.Id,
            expense.Date,
            expense.Amount,
            expense.Category.ToString(),
            expense.PaymentMethod.ToString(),
            expense.CreatedAt
        );
    }

    public async Task<ExpenseResponse?> UpdateExpenseAsync(int id, int userId, CreateExpenseRequest request)
    {
        var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (expense == null) return null;

        expense.Date = request.Date;
        expense.Amount = request.Amount;
        expense.Category = Enum.Parse<ExpenseCategory>(request.Category, true);
        expense.PaymentMethod = Enum.Parse<PaymentMethod>(request.PaymentMethod, true);

        await _context.SaveChangesAsync();

        return new ExpenseResponse(
            expense.Id,
            expense.Date,
            expense.Amount,
            expense.Category.ToString(),
            expense.PaymentMethod.ToString(),
            expense.CreatedAt
        );
    }

    public async Task<bool> DeleteExpenseAsync(int id, int userId)
    {
        var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (expense == null) return false;

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();
        return true;
    }

}


