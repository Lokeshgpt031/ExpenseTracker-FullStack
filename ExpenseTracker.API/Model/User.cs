using System;
using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.API.Models;

public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // Hashed password
        public UserRole Role { get; set; }
        public string Profession { get; set; } = string.Empty; // Auto Driver, Plumber, Electrician, etc.
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public ICollection<Earning> Earnings { get; set; } = new List<Earning>();
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }

    public enum UserRole
    {
        [Display(Name = "Daily Earner")]
        DailyEarner,

        [Display(Name = "Administrator")]
        Admin
    }
