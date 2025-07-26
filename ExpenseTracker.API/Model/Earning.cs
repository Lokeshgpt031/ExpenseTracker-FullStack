using System;
using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.API.Models;

public class Earning
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public int? SourceId { get; set; }
    public EarningType Type { get; set; } = EarningType.Regular;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
    public Source? Source { get; set; }


}



public enum EarningType
{
    [Display(Name = "Regular")]
    Regular,

    [Display(Name = "Bonus")]
    Bonus,

    [Display(Name = "Tips")]
    Tips,

    [Display(Name = "Overtime")]
    Overtime,

    [Display(Name = "Advance")]
    Advance,
}
public enum PaymentMethod
{
    [Display(Name = "UPI")]
    UPI,
    
    [Display(Name = "Cash")]
    Cash,
    
    [Display(Name = "App")]
    App,
    
    [Display(Name = "Bank Transfer")]
    BankTransfer,
    
    [Display(Name = "Card")]
    Card,
    
    [Display(Name = "Other")]
    Other
}
