using BackEnd.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;

namespace BackEnd.Authentication
{
    public class CookieJwtAuthenticationHandler
        : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IJwtService _jwtService;
        private readonly IAuthService _authService;

        public CookieJwtAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            IJwtService jwtService,
            IAuthService authService)
            : base(options, logger, encoder)
        {
            _jwtService = jwtService;
            _authService = authService;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var accessToken = Request.Cookies["accessToken"];

            if (string.IsNullOrEmpty(accessToken))
            {
                return AuthenticateResult.NoResult();
            }

            // First validate existing access token
            var principal = _jwtService.ValidateToken(accessToken);

            // Access token is valid
            if (principal != null)
            {
                var ticket = new AuthenticationTicket(
                    principal,
                    Scheme.Name
                );

                return AuthenticateResult.Success(ticket);
            }

            // Access token is invalid/expired → try refresh
            try
            {
                var newAccessToken = await _authService.RefreshTokenAsync();

                // Validate the newly generated token
                var newPrincipal = _jwtService.ValidateToken(newAccessToken);

                if (newPrincipal != null)
                {
                    var ticket = new AuthenticationTicket(
                        newPrincipal,
                        Scheme.Name
                    );

                    return AuthenticateResult.Success(ticket);
                }
            }
            catch
            {
                // Refresh failed
            }

            return AuthenticateResult.Fail("Invalid access token");
        }
    }
}