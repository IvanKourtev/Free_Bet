using System.ComponentModel.DataAnnotations;

namespace FreeBet.API.Models;

public class Match
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public required string HomeTeam { get; set; }

    [Required]
    [MaxLength(100)]
    public required string AwayTeam { get; set; }

    public DateTime MatchTime { get; set; }

    public int? HomeTeamGoals { get; set; }

    public int? AwayTeamGoals { get; set; }

    public bool IsFinished { get; set; }

    public DateTime CreatedAt { get; set; }

    // Навигационни свойства
    public required ICollection<Bet> Bets { get; set; }
} 