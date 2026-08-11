using BackEnd.DTOs;

namespace BackEnd.Interfaces
{
    public interface IAuthService
    {
        Task<TokenResponseDto> RegisterAsync(RegisterDto register);
        Task<TokenResponseDto> LoginAsync(LoginDto login);
        Task<TokenResponseDto> RefreshTokenAsync();

        Task<TokenResponseDto> GetCurrentUserAsync();
        Task LogoutAsync();
    }
}
