using BackEnd.Common;
using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly CloudinaryImageStorageService _imageStorageService;
        public AuthController(IAuthService authService , CloudinaryImageStorageService imageStorage)
        {
            _authService = authService;
            _imageStorageService = imageStorage;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<TokenResponseDto>>> Register([FromForm] RegisterDto register,IFormFile? Image )
        {
            var response = new ApiResponse<TokenResponseDto>();
            try
            {
                string? profilepicurl = null;
                if (Image != null && Image.Length >0)
                {
                    profilepicurl=await _imageStorageService.UploadImage(Image);

                }
                var result= await _authService.RegisterAsync(register,profilepicurl);
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
        public async Task<ActionResult<ApiResponse<string>>> Refresh()
        {
            var response = new ApiResponse<string>();

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
        [HttpPost("google")]
        public async Task<ActionResult<ApiResponse<TokenResponseDto>>> GoogleLogin([FromBody] GoogleLoginDto loginDto)
        {
            var response = new ApiResponse<TokenResponseDto>();
            try
            {
                var result=await _authService.GoogleLoginAsync(loginDto);
                response.Result = result;
                return Ok(response);
            }catch(Exception ex)
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
