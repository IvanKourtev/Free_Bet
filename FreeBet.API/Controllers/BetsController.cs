using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreeBet.API.Data;
using FreeBet.API.Models;

namespace FreeBet.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BetsController : ControllerBase
{
    private readonly FreeBetContext _context;

    public BetsController(FreeBetContext context)
    {
        _context = context;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserBets(int userId)
    {
        var bets = await _context.Bets
            .Include(b => b.Match)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return Ok(bets);
    }

    [HttpPost]
    public async Task<IActionResult> PlaceBet([FromBody] PlaceBetRequest request)
    {
        // Проверка дали мачът съществува и не е започнал
        var match = await _context.Matches
            .FirstOrDefaultAsync(m => m.Id == request.MatchId);

        if (match == null)
        {
            return NotFound("Мачът не е намерен.");
        }

        if (match.MatchTime <= DateTime.Now)
        {
            return BadRequest("Не можете да залагате след началото на мача.");
        }

        // Проверка дали потребителят вече е залагал за този мач
        var existingBet = await _context.Bets
            .FirstOrDefaultAsync(b => b.UserId == request.UserId && b.MatchId == request.MatchId);

        if (existingBet != null)
        {
            return BadRequest("Вече сте направили залог за този мач.");
        }

        // Проверка за брой залози за деня
        var today = DateTime.Today;
        var tomorrow = today.AddDays(1);
        var betsToday = await _context.Bets
            .CountAsync(b => b.UserId == request.UserId && 
                           b.CreatedAt >= today && 
                           b.CreatedAt < tomorrow);

        if (betsToday >= 3)
        {
            return BadRequest("Достигнахте лимита от 3 залога за деня.");
        }

        // Обновяване на LastBetDate на потребителя
        var user = await _context.Users.FindAsync(request.UserId);
        if (user == null)
        {
            return NotFound("Потребителят не е намерен.");
        }

        var bet = new Bet
        {
            UserId = request.UserId,
            User = user,
            MatchId = request.MatchId,
            Match = match,
            PredictedHomeGoals = request.PredictedHomeGoals,
            PredictedAwayGoals = request.PredictedAwayGoals,
            Points = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bets.Add(bet);

        user.LastBetDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Залогът е приет успешно!" });
    }
}

public class PlaceBetRequest
{
    public int UserId { get; set; }
    public int MatchId { get; set; }
    public int PredictedHomeGoals { get; set; }
    public int PredictedAwayGoals { get; set; }
} 