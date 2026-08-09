using BackEnd.Common;
using BackEnd.DTOs;
using BackEnd.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ApiResponse<string>> Register(RegisterDto register)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _authService.RegisterAsync(register);
                response.Result = "User registered successfully";
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }
            return response;
        }

        [HttpPost("login")]
        public async Task<ApiResponse<TokenResponseDto>> Login(LoginDto login)
        {
            var response = new ApiResponse<TokenResponseDto>();
            try
            {
               var result= await _authService.LoginAsync(login);
                response.Result = result;
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });

            }
            return response;
        }
        [HttpPost("refresh")]
        public async Task<ApiResponse<TokenResponseDto>> Refresh()
        {
            var response = new ApiResponse<TokenResponseDto>();

            try
            {
                var result = await _authService.RefreshTokenAsync();

                response.Result = result;
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }

            return response;
        }

        [HttpGet("me")]
        public async Task<ApiResponse<TokenResponseDto>> GetCurrentUser()
        {
            var response= new ApiResponse<TokenResponseDto>();
            try
            {
                var user = await _authService.GetCurrentUserAsync();

                response.Result = user;
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "401",
                    Message = ex.Message
                });
            }
            return response;
        }

    }
}
