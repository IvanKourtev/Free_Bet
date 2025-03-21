using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreeBet.API.Data;
using FreeBet.API.Models;

namespace FreeBet.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaderboardController : ControllerBase
{
    private readonly FreeBetContext _context;

    public LeaderboardController(FreeBetContext context)
    {
        _context = context;
    }

    [HttpGet("daily")]
    public async Task<IActionResult> GetDailyLeaderboard()
    {
        var today = DateTime.Today;
        var tomorrow = today.AddDays(1);

        var dailyLeaderboard = await _context.DailyBonuses
            .Include(db => db.User)
            .Where(db => db.Date >= today && db.Date < tomorrow)
            .OrderByDescending(db => db.BonusPoints)
            .ThenByDescending(db => db.ExactScores)
            .ThenByDescending(db => db.CorrectPredictions)
            .Select(db => new
            {
                db.User.Nickname,
                db.BonusPoints,
                db.ExactScores,
                db.CorrectPredictions
            })
            .ToListAsync();

        return Ok(dailyLeaderboard);
    }

    [HttpGet("weekly")]
    public async Task<IActionResult> GetWeeklyLeaderboard()
    {
        var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
        var endOfWeek = startOfWeek.AddDays(7);

        var weeklyLeaderboard = await _context.Users
            .Select(u => new
            {
                u.Nickname,
                TotalPoints = u.Points,
                WeeklyPoints = _context.DailyBonuses
                    .Where(db => db.UserId == u.Id && 
                                db.Date >= startOfWeek && 
                                db.Date < endOfWeek)
                    .Sum(db => db.BonusPoints),
                ExactScores = _context.Bets
                    .Count(b => b.UserId == u.Id && 
                               b.Points == 3 &&
                               b.CreatedAt >= startOfWeek && 
                               b.CreatedAt < endOfWeek),
                CorrectPredictions = _context.Bets
                    .Count(b => b.UserId == u.Id && 
                               b.Points == 1 &&
                               b.CreatedAt >= startOfWeek && 
                               b.CreatedAt < endOfWeek)
            })
            .OrderByDescending(x => x.WeeklyPoints)
            .ThenByDescending(x => x.ExactScores)
            .ThenByDescending(x => x.CorrectPredictions)
            .ToListAsync();

        return Ok(weeklyLeaderboard);
    }

    [HttpGet("all-time")]
    public async Task<IActionResult> GetAllTimeLeaderboard()
    {
        var allTimeLeaderboard = await _context.Users
            .OrderByDescending(u => u.Points)
            .Select(u => new
            {
                u.Nickname,
                TotalPoints = u.Points,
                ExactScores = _context.Bets
                    .Count(b => b.UserId == u.Id && b.Points == 3),
                CorrectPredictions = _context.Bets
                    .Count(b => b.UserId == u.Id && b.Points == 1)
            })
            .ToListAsync();

        return Ok(allTimeLeaderboard);
    }
} 