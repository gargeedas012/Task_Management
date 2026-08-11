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
        public async Task<ActionResult<ApiResponse<TokenResponseDto>>> Register(RegisterDto register)
        {
            var response = new ApiResponse<TokenResponseDto>();
            try
            {
               var result= await _authService.RegisterAsync(register);
                response.Result = result;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return Unauthorized(response);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<TokenResponseDto>>> Login(LoginDto login)
        {
            var response = new ApiResponse<TokenResponseDto>();
            try
            {
                var result = await _authService.LoginAsync(login);
                response.Result = result;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Errors.Add(new ApiError
                {
                    Code = "401",
                    Message = ex.Message
                });
                return Unauthorized(response);
            }
        }
        [HttpPost("refresh")]
        public async Task<ActionResult<ApiResponse<TokenResponseDto>>> Refresh()
        {
            var response = new ApiResponse<TokenResponseDto>();

            try
            {
                var result = await _authService.RefreshTokenAsync();

                response.Result = result;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return Unauthorized(response);
            }
        }

        [HttpGet("me")]
        public async Task<ActionResult<ApiResponse<TokenResponseDto>>> GetCurrentUser()
        {
            var response= new ApiResponse<TokenResponseDto>();
            try
            {
                var user = await _authService.GetCurrentUserAsync();

                response.Result = user;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Errors.Add(new ApiError
                {
                    Code = "401",
                    Message = ex.Message
                });
                return Unauthorized(response);
            }
        }

        [HttpPost("logout")]
        public async Task<ActionResult<ApiResponse<string>>> Logout()
        {
            var response = new ApiResponse<string>();
            try
            {
                await _authService.LogoutAsync();
                response.Result = "Logged out successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return Unauthorized(response);
            }
        }
    }
}
