using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using BackEnd.Settings;
using Google.Apis.Auth;
using Microsoft.Extensions.Options;
using Microsoft.Win32;

namespace BackEnd.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly GoogleSettings _googleSettings;
        public AuthService(IUserService userService, IJwtService jwtService, IHttpContextAccessor httpContextAccessor ,IOptions<GoogleSettings> googleSettings)
        {
            _userService = userService;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
            _googleSettings = googleSettings.Value;
        }
        public async Task<TokenResponseDto> LoginAsync(LoginDto login)
        {
            var user = await _userService.GetByEmailAsync(login.Email);
            if (user == null)
            {
                throw new Exception("No Email exists");
            }
            bool passwordMatch = BCrypt.Net.BCrypt.Verify(
                login.Password,
                user.Password
                );
            if(!passwordMatch)
            {
                throw new Exception("Invalid  password");
            }
            var token = _jwtService.GenerateToken(user);
            var ipAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
            var refreshToken = new RefreshTokenResponseDto
            {
                Token = _jwtService.GenerateRefreshToken(),
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow,
                IpAddress = ipAddress ?? ""

            };
            user.RefreshTokens.Add(refreshToken);
            await _userService.UpdateAsync(user.Id, user);
                        var httpContext = _httpContextAccessor.HttpContext;

            httpContext?.Response.Cookies.Append(
                "accessToken",
                token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(30)
                });

            httpContext?.Response.Cookies.Append(
                "refreshToken",
                refreshToken.Token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = refreshToken.ExpiryDate
                });
            return new TokenResponseDto
            {
                Username=user.Username,
                UserId=user.Id.ToString(),
                Email=user.Email,
                Role=user.Role
            };

        }

        public async Task<string> RefreshTokenAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null)
            {
                throw new Exception("HTTP context not available");
            }

            // Get refresh token from cookie
            var refreshToken = httpContext.Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new Exception("Refresh token not found");
            }

            // Find user
            var user = await _userService.GetByRefreshTokenAsync(refreshToken);

            if (user == null)
            {
                throw new Exception("Invalid refresh token");
            }

            // Find stored token
            var storedToken = user.RefreshTokens
                .FirstOrDefault(x => x.Token == refreshToken);

            if (storedToken == null)
            {
                throw new Exception("Invalid refresh token");
            }

            // Check revoked
            if (storedToken.IsRevoked)
            {
                throw new Exception("Refresh token revoked");
            }

            // Check expiry
            if (storedToken.ExpiryDate < DateTime.UtcNow)
            {
                throw new Exception("Refresh token expired");
            }

            // Generate new access token
            var newAccessToken = _jwtService.GenerateToken(user);

            // Store new access token in cookie
            httpContext.Response.Cookies.Append(
                "accessToken",
                newAccessToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(30)
                });

            return newAccessToken;
        }

        public async Task<TokenResponseDto> RegisterAsync(RegisterDto register)
        {
            var existing = await _userService.GetByEmailAsync(register.Email);
            if (existing != null)
            {
                throw new Exception("Email already exists");
            }
            var user = new User
            {
                Username = register.Username,
                Email = register.Email,

                Password = BCrypt.Net.BCrypt.HashPassword(
                    register.Password
                ),

                Role = "User"
            };
            await _userService.CreateAsync(user);
            var finduser= await _userService.GetByEmailAsync(register.Email);
            return new TokenResponseDto
            {
                Username = finduser.Username,
                UserId = finduser.Id.ToString(),
                Email = finduser.Email,
                Role = finduser.Role
            };
            //var login = new LoginDto
            //{
            //    Email = register.Email,
            //    Password = register.Password
            //};
            //await LoginAsync(login);
        }

        public async Task<TokenResponseDto> GetCurrentUserAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null)
            {
                throw new Exception("HTTP context not available");
            }

            // Get access token from cookie
            var accessToken = httpContext.Request.Cookies["accessToken"];

            if (string.IsNullOrEmpty(accessToken))
            {
                throw new Exception("Access token not found");
            }

            // Validate access token
            var principal = _jwtService.ValidateToken(accessToken);

            if (principal == null)
            {
                throw new Exception("Invalid or expired access token");
            }

            // Get user email from token
            var email = principal.FindFirst(
                System.Security.Claims.ClaimTypes.Email
            )?.Value;

            if (string.IsNullOrEmpty(email))
            {
                throw new Exception("Email claim not found");
            }

            // Find user
            var user = await _userService.GetByEmailAsync(email);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            return new TokenResponseDto
            {
                Username = user.Username,
                UserId = user.Id.ToString(),
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task LogoutAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null)
            {
                throw new Exception("HTTP context not available");
            }

            // Get refresh token from cookie
            var refreshToken = httpContext.Request.Cookies["refreshToken"];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                // Find user using refresh token
                var user = await _userService.GetByRefreshTokenAsync(refreshToken);

                if (user != null)
                {
                    // Find stored refresh token
                    var storedToken = user.RefreshTokens
                        .FirstOrDefault(x => x.Token == refreshToken);

                    if (storedToken != null)
                    {
                        // Revoke refresh token
                        storedToken.IsRevoked = true;

                        await _userService.UpdateAsync(user.Id, user);
                    }
                }
            }

            // Delete access token cookie
            httpContext.Response.Cookies.Delete(
                "accessToken",
                new CookieOptions
                {
                    Secure = true,
                    SameSite = SameSiteMode.None
                });

            // Delete refresh token cookie
            httpContext.Response.Cookies.Delete(
                "refreshToken",
                new CookieOptions
                {
                    Secure = true,
                    SameSite = SameSiteMode.None
                });
        }
        public async Task<TokenResponseDto> GoogleLoginAsync(GoogleLoginDto request)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _googleSettings.ClientId }
                });
            if(payload == null)
            {
                throw new Exception("Invalid Google token");
            }
            var user= await _userService.GetByEmailAsync(payload.Email);
            if(user == null)
            {
                user = new User
                {
                    Username = payload.Name,
                    Email = payload.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                    Role = "User"
                };
                await _userService.CreateAsync(user);
                user = await _userService.GetByEmailAsync(payload.Email);

                if (user == null)
                {
                    throw new Exception("Failed to create Google user");
                }                              
            }
            // Generate your application's JWT
            var token = _jwtService.GenerateToken(user);
            var ipAddress =
                _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
            var refreshToken = new RefreshTokenResponseDto
            {
                Token = _jwtService.GenerateRefreshToken(),
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow,
                IpAddress = ipAddress ?? ""
            };
            user.RefreshTokens.Add(refreshToken);
            await _userService.UpdateAsync(user.Id, user);
            var httpContext = _httpContextAccessor.HttpContext;
            httpContext?.Response.Cookies.Append(
                "accessToken",
                token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(30)
                });
            httpContext?.Response.Cookies.Append(
                "refreshToken",
                refreshToken.Token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = refreshToken.ExpiryDate
                });
            return new TokenResponseDto
            {
                Username = user.Username,
                UserId = user.Id.ToString(),
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}
