using System.ComponentModel.DataAnnotations;

namespace FreeBet.API.Models;

public class DailyBonus
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public required User User { get; set; }

    public DateTime Date { get; set; }

    public int CorrectPredictions { get; set; }

    public int ExactScores { get; set; }

    public int BonusPoints { get; set; }

    public DateTime CreatedAt { get; set; }
} 