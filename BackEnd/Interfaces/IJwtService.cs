using BackEnd.DTOs;
using BackEnd.Models;
using System.Security.Claims;

namespace BackEnd.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        string GenerateRefreshToken();
        ClaimsPrincipal? ValidateToken(string token);
        //ClaimsPrincipal ValidateToken(TokenResponseDto newAccessToken);
    }
}

