using System.ComponentModel.DataAnnotations;

namespace FreeBet.API.Models;

public class Bet
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public required User User { get; set; }

    public int MatchId { get; set; }
    public required Match Match { get; set; }

    public int PredictedHomeGoals { get; set; }
    public int PredictedAwayGoals { get; set; }

    public int Points { get; set; }

    public DateTime CreatedAt { get; set; }
} 