using Microsoft.EntityFrameworkCore;
namespace ExpenseTracker.API.Models;

public class ExpenseTrackerDbContext : DbContext
{
    public ExpenseTrackerDbContext(DbContextOptions<ExpenseTrackerDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Earning> Earnings { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Source> Sources { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Role)
                .HasConversion<string>();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Earning configuration
        modelBuilder.Entity<Earning>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Type)
                .HasConversion<string>();
            entity.Property(e => e.PaymentMethod)
                .HasConversion<string>();
            entity.HasOne(e => e.User).WithMany(u => u.Earnings).HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.Source).WithMany(s => s.Earnings).HasForeignKey(e => e.SourceId);
        });

        // Expense configuration
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Category)
                .HasConversion<string>();
            entity.Property(e => e.PaymentMethod)
                .HasConversion<string>();
            entity.HasOne(e => e.User).WithMany(u => u.Expenses).HasForeignKey(e => e.UserId);
        });

        // Source configuration
        modelBuilder.Entity<Source>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });
    }
}