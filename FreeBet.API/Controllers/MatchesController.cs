using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreeBet.API.Data;
using FreeBet.API.Models;

namespace FreeBet.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchesController : ControllerBase
{
    private readonly FreeBetContext _context;

    public MatchesController(FreeBetContext context)
    {
        _context = context;
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetTodayMatches()
    {
        var today = DateTime.Today;
        var tomorrow = today.AddDays(1);

        var matches = await _context.Matches
            .Where(m => m.MatchTime >= today && m.MatchTime < tomorrow)
            .OrderBy(m => m.MatchTime)
            .ToListAsync();

        return Ok(matches);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMatch(int id)
    {
        var match = await _context.Matches
            .FirstOrDefaultAsync(m => m.Id == id);

        if (match == null)
        {
            return NotFound("Мачът не е намерен.");
        }

        return Ok(match);
    }

    // Този endpoint ще се използва само от администратори
    [HttpPost]
    public async Task<IActionResult> CreateMatch([FromBody] CreateMatchRequest request)
    {
        var match = new Match
        {
            HomeTeam = request.HomeTeam,
            AwayTeam = request.AwayTeam,
            MatchTime = request.MatchTime,
            IsFinished = false,
            CreatedAt = DateTime.UtcNow,
            Bets = new List<Bet>()
        };

        _context.Matches.Add(match);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMatch), new { id = match.Id }, match);
    }

    // Този endpoint ще се използва само от администратори
    [HttpPut("{id}/result")]
    public async Task<IActionResult> UpdateMatchResult(int id, [FromBody] UpdateMatchResultRequest request)
    {
        var match = await _context.Matches
            .Include(m => m.Bets)
            .ThenInclude(b => b.User)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (match == null)
        {
            return NotFound("Мачът не е намерен.");
        }

        match.HomeTeamGoals = request.HomeTeamGoals;
        match.AwayTeamGoals = request.AwayTeamGoals;
        match.IsFinished = true;

        // Изчисляване на точки за всички залози за този мач
        foreach (var bet in match.Bets)
        {
            // 5 точки за точен резултат
            if (bet.PredictedHomeGoals == match.HomeTeamGoals && 
                bet.PredictedAwayGoals == match.AwayTeamGoals)
            {
                bet.Points = 5;
            }
            // 1 точка за познат победител
            else if ((bet.PredictedHomeGoals > bet.PredictedAwayGoals && match.HomeTeamGoals > match.AwayTeamGoals) ||
                     (bet.PredictedHomeGoals < bet.PredictedAwayGoals && match.HomeTeamGoals < match.AwayTeamGoals) ||
                     (bet.PredictedHomeGoals == bet.PredictedAwayGoals && match.HomeTeamGoals == match.AwayTeamGoals))
            {
                bet.Points = 1;
            }

            // Добавяне на точките към общия брой точки на потребителя
            bet.User.Points += bet.Points;
        }

        await _context.SaveChangesAsync();

        return Ok(match);
    }
}

public class CreateMatchRequest
{
    public required string HomeTeam { get; set; }
    public required string AwayTeam { get; set; }
    public DateTime MatchTime { get; set; }
}

public class UpdateMatchResultRequest
{
    public int HomeTeamGoals { get; set; }
    public int AwayTeamGoals { get; set; }
} 