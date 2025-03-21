using Microsoft.EntityFrameworkCore;
using FreeBet.API.Models;

namespace FreeBet.API.Data;

public class FreeBetContext : DbContext
{
    public FreeBetContext(DbContextOptions<FreeBetContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<Bet> Bets { get; set; }
    public DbSet<DailyBonus> DailyBonuses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.PhoneNumber)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Nickname)
            .IsUnique();

        modelBuilder.Entity<Bet>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bets)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Bet>()
            .HasOne(b => b.Match)
            .WithMany(m => m.Bets)
            .HasForeignKey(b => b.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DailyBonus>()
            .HasOne(d => d.User)
            .WithMany(u => u.DailyBonuses)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
} 