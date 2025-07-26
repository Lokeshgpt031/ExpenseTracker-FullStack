using System;

namespace ExpenseTracker.API.Models;

public class Source
{

    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;


    // Navigation properties
    public ICollection<Earning> Earnings { get; set; } = new List<Earning>();

}
