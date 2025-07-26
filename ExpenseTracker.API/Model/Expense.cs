using System;
using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.API.Models;

public class Expense
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public ExpenseCategory Category { get; set; }

    public decimal Amount { get; set; }
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = null!;

}


public enum ExpenseCategory
{
    [Display(Name = "LPG")]
    LPG,

    [Display(Name = "Petrol")]
    Petrol,

    [Display(Name = "Maintenance")]
    Maintenance,

    [Display(Name = "Tools")]
    Tools,

    [Display(Name = "Food")]
    Food,

    [Display(Name = "Transportation")]
    Transportation,

    [Display(Name = "Insurance")]
    Insurance,

    [Display(Name = "Permits")]
    Permits,

    [Display(Name = "Rent")]
    Rent,

    [Display(Name = "Utilities")]
    Utilities,

    [Display(Name = "Medical")]
    Medical,

    [Display(Name = "Education")]
    Education,

    [Display(Name = "Entertainment")]
    Entertainment,

    [Display(Name = "Other")]
    Other
}

