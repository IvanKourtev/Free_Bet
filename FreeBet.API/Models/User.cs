using System.ComponentModel.DataAnnotations;

namespace FreeBet.API.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    public required string PhoneNumber { get; set; }

    [Required]
    public required string Nickname { get; set; }

    [Required]
    public required string FullName { get; set; }

    public int Points { get; set; }

    public DateTime? LastBetDate { get; set; }

    public DateTime CreatedAt { get; set; }

    // Навигационни свойства
    public required ICollection<Bet> Bets { get; set; }
    public required ICollection<DailyBonus> DailyBonuses { get; set; }
} 