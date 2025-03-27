using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreeBet.API.Models;
using FreeBet.API.Data;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Twilio;
using Twilio.Rest.Verify.V2.Service;
using FreeBet.API.Services;

namespace FreeBet.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly FreeBetContext _context;
    private readonly JwtService _jwtService;
    private readonly IConfiguration _configuration;

    public AuthController(FreeBetContext context, JwtService jwtService, IConfiguration configuration)
    {
        _context = context;
        _jwtService = jwtService;
        _configuration = configuration;
        
        // Инициализация на Twilio клиента
        var twilioSettings = _configuration.GetSection("Twilio");
        TwilioClient.Init(twilioSettings["AccountSid"], twilioSettings["AuthToken"]);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Проверка дали телефонният номер вече съществува
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);

        if (existingUser != null)
        {
            return BadRequest("Този телефонен номер вече е регистриран.");
        }

        // Проверка дали никнеймът вече съществува
        var existingNickname = await _context.Users
            .FirstOrDefaultAsync(u => u.Nickname == request.Nickname);

        if (existingNickname != null)
        {
            return BadRequest("Този никнейм вече е зает.");
        }

        try
        {
            // Изпращане на SMS за верификация
            var verification = await VerificationResource.CreateAsync(
                to: request.PhoneNumber,
                channel: "sms",
                pathServiceSid: _configuration["Twilio:VerifyServiceSid"]
            );

            return Ok(new { message = "Изпратен е код за верификация." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Грешка при изпращане на SMS: " + ex.Message);
        }
    }

    [HttpPost("verify")]
    public async Task<IActionResult> Verify([FromBody] VerifyRequest request)
    {
        try
        {
            // Проверка на кода
            var verificationCheck = await VerificationCheckResource.CreateAsync(
                to: request.PhoneNumber,
                code: request.Code,
                pathServiceSid: _configuration["Twilio:VerifyServiceSid"]
            );

            if (verificationCheck.Status != "approved")
            {
                return BadRequest("Невалиден код за верификация.");
            }

            // Създаване на нов потребител
            var user = new User
            {
                PhoneNumber = request.PhoneNumber,
                Nickname = request.Nickname,
                FullName = request.FullName,
                Points = 0,
                CreatedAt = DateTime.UtcNow,
                Bets = new List<Bet>(),
                DailyBonuses = new List<DailyBonus>()
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Генериране на JWT токен
            var token = _jwtService.GenerateToken(user);

            return Ok(new { token, user.Nickname });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Грешка при верификация: " + ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            // Изпращаме код за верификация
            var verification = await VerificationResource.CreateAsync(
                to: request.PhoneNumber,
                channel: "sms",
                pathServiceSid: _configuration["Twilio:VerifyServiceSid"]
            );

            return Ok(new { message = "Изпратен е код за верификация." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Грешка при изпращане на SMS: " + ex.Message);
        }
    }

    [HttpPost("verify-login")]
    public async Task<IActionResult> VerifyLogin([FromBody] VerifyLoginRequest request)
    {
        try
        {
            // Проверка на кода
            var verificationCheck = await VerificationCheckResource.CreateAsync(
                to: request.PhoneNumber,
                code: request.Code,
                pathServiceSid: _configuration["Twilio:VerifyServiceSid"]
            );

            if (verificationCheck.Status != "approved")
            {
                return BadRequest("Невалиден код за верификация.");
            }

            // Намиране на потребителя
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);

            if (user == null)
            {
                return NotFound("Потребителят не е намерен.");
            }

            // Генериране на JWT токен
            var token = _jwtService.GenerateToken(user);

            return Ok(new { token, user.Nickname });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Грешка при верификация: " + ex.Message);
        }
    }

    [HttpPost("check-user")]
    public async Task<IActionResult> CheckUser([FromBody] CheckUserRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);

        return Ok(new { exists = user != null });
    }
}

public class RegisterRequest
{
    public required string PhoneNumber { get; set; }
    public required string Nickname { get; set; }
    public required string FullName { get; set; }
}

public class VerifyRequest
{
    public required string PhoneNumber { get; set; }
    public required string Nickname { get; set; }
    public required string FullName { get; set; }
    public required string Code { get; set; }
}

public class LoginRequest
{
    public required string PhoneNumber { get; set; }
}

public class VerifyLoginRequest
{
    public required string PhoneNumber { get; set; }
    public required string Code { get; set; }
}

public class CheckUserRequest
{
    public required string PhoneNumber { get; set; }
} 