using System;
using System.ComponentModel.DataAnnotations;
using ExpenseTracker.API.Attributes;
using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Records;

public record CreateEarningRequest(
    [Required] DateTime Date,
    [Required][Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")] decimal Amount,
    int? SourceId,
    [ValidEnum(typeof(EarningType))] string Type = nameof(EarningType.Regular),
    [ValidEnum(typeof(PaymentMethod))] string PaymentMethod=nameof(PaymentMethod.UPI)
);
public record EarningResponse(
    int Id,
    DateTime Date,
    decimal Amount,
    string SourceName,
    string Type,
    string PaymentMethod,
    DateTime CreatedAt
);

public record LoginRequest(
    [Required] string Email = "",
    [Required] string Password = ""
);
public record RegisterRequest(
    [Required] string Name = "",
    [Required] string Email = "",
    [Required] string PhoneNumber = "",
    [Required] string Password = "",
    [Required] string Profession = ""
);
public record AuthResponse(
    string Token,
    UserResponse User,
    DateTime ExpiresAt
);
public record ChangePasswordRequest(
    [Required] string CurrentPassword = "",
    [Required] string NewPassword = ""
);
public record UpdateUserRequest(
    [Required] string Name = "",
    [Required] string PhoneNumber = "",
    [Required] string Profession = ""
);

public record CreateExpenseRequest(
    [Required] DateTime Date,
    [Required][Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")] decimal Amount,
    [ValidEnum(typeof(ExpenseCategory))] string Category=nameof(ExpenseCategory.LPG),
    [ValidEnum(typeof(PaymentMethod))] string PaymentMethod = nameof(PaymentMethod.Cash)
    );
public record ExpenseResponse(
    int Id,
    DateTime Date,
    decimal Amount,
    string Category,
    string PaymentMethod,
    DateTime CreatedAt
);

public record CreateUserRequest(
    [Required] string Name = "",
    [Required] string Email = "",
    [Required] string PhoneNumber = "",
    [Required] string Profession = ""
);

public record UserResponse(
    int Id,
    string Name,
    string Email,
    string PhoneNumber,
    string Profession,
    DateTime CreatedAt
);
public record DailySummaryResponse(
    DateTime Date,
    decimal TotalEarnings,
    decimal TotalExpenses,
    decimal NetIncome,
    int EarningsCount,
    int ExpensesCount
);

public record TrendDataResponse(
    DateTime Date,
    decimal Earnings,
    decimal Expenses,
    decimal NetIncome
);

public record AnalyticsResponse(
    decimal TotalEarnings,
    decimal TotalExpenses,
    decimal NetIncome,
    decimal AverageEarningsPerDay,
    decimal AverageExpensesPerDay,
    Dictionary<string, decimal> EarningsBySource,
    Dictionary<string, decimal> ExpensesByCategory,
    List<TrendDataResponse> WeeklyTrends,
    List<TrendDataResponse> MonthlyTrends
);

public record CreateSourceRequest(
    [Required][StringLength(100, MinimumLength = 1)] string Name = "",
    string Description = "");