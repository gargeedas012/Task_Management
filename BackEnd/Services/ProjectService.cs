using BackEnd.Interfaces;
using BackEnd.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IJwtService _jwtService;
        private readonly IAuthService _authService;

        public ProjectService(
            IProjectRepository repository, 
            IHttpContextAccessor httpContextAccessor, 
            IJwtService jwtService, 
            IAuthService authService)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
            _jwtService = jwtService;
            _authService = authService;
        }

        private async Task VerifyAuthAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null) return;

            var accessToken = httpContext.Request.Cookies["accessToken"];
            var refreshToken = httpContext.Request.Cookies["refreshToken"];
            
            bool refreshNeeded = false;

            if (string.IsNullOrEmpty(accessToken))
            {
                refreshNeeded = true;
            }
            else
            {
                var principal = _jwtService.ValidateToken(accessToken);
                if (principal == null)
                {
                    refreshNeeded = true;
                }
            }

            if (refreshNeeded)
            {
                if (string.IsNullOrEmpty(refreshToken))
                {
                    throw new UnauthorizedAccessException("Unauthorized: No valid tokens.");
                }
                
                try
                {
                    await _authService.RefreshTokenAsync();
                }
                catch
                {
                    throw new UnauthorizedAccessException("Unauthorized: Token refresh failed.");
                }
            }
        }

        public async Task CreateProjectAsync(Project project)
        {
            await VerifyAuthAsync();
            project.CreatedDate = DateTime.UtcNow;
            await _repository.CreateProjectAsync(project);
        }

        public async Task DeleteProjectAsync(string id)
        {
            await VerifyAuthAsync();
            await _repository.DeleteProjectAsync(id);
        }

        public async Task<List<Project>> GetAllProjectsAsync()
        {
            await VerifyAuthAsync();
            return await _repository.GetAllProjectsAsync();
        }

        public async Task<List<Project>> GetProjectsByUserIdAsync(string userId)
        {
            await VerifyAuthAsync();
            return await _repository.GetProjectsByUserIdAsync(userId);
        }

        public async Task UpdateProjectAsync(string id, Project project)
        {
            await VerifyAuthAsync();
            project.Id = id;
            await _repository.UpdateProjectAsync(id, project);
        }
    }
}
