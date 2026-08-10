using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using Microsoft.AspNetCore.Http;
using System;

namespace BackEnd.Services
{
    public class TodoService : ITodoService
    {
        private  readonly ITodoRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IJwtService _jwtService;
        private readonly IAuthService _authService;

        public TodoService(ITodoRepository repository, IHttpContextAccessor httpContextAccessor, IJwtService jwtService, IAuthService authService)
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

        public async Task CreateAsync(CreateTodoDto createTodoDto)
        {
            await VerifyAuthAsync();
            var todo = new Todo
            {
                Title = createTodoDto.Title,
                UserId = createTodoDto.UserId,
                ProjectId=createTodoDto.ProjectId,
                Description = createTodoDto.Description,
                Priority = createTodoDto.Priority,
                DueDate = createTodoDto.DueDate,
                Category = createTodoDto.Category,
                IsCompleted = createTodoDto.IsCompleted,
                CreatedDate = DateTime.UtcNow
            };
            await _repository.CreateAsync(todo);
        }

        public async Task DeleteAsync(string id)
        {
            await VerifyAuthAsync();
            await _repository.DeleteAsync(id);
        }

        public async Task<List<Todo>> GetAllAsync()
        {
           await VerifyAuthAsync();
           return await _repository.GetAllAsync();
        }

        public async Task<Todo?> GetByIdAsync(string id)
        {
           await VerifyAuthAsync();
           return await _repository.GetByIdAsync(id);
        }

        public async Task UpdateAsync(string id, UpdateTodoDto updateTodoDto)
        {
            await VerifyAuthAsync();
            var todo = new Todo
            {
                Id = id,
                Title = updateTodoDto.Title,
                UserId = updateTodoDto.UserId,
                ProjectId=updateTodoDto.ProjectId,
                Description = updateTodoDto.Description,
                Priority = updateTodoDto.Priority,
                DueDate = updateTodoDto.DueDate,
                Category = updateTodoDto.Category,
                IsCompleted = updateTodoDto.IsCompleted
            };
            await _repository.UpdateAsync(id, todo);
        }

        public async Task<List<InCompleteTodoResponseDto>> GetIncompleteTodos(bool isCompleted)
        {
            await VerifyAuthAsync();
            return await _repository.GetIncompleteTodos(isCompleted);
        }
        
        public async Task<List<PriorityCountDto>> GetPriorityCount()
        {
            await VerifyAuthAsync();
            return await _repository.GetPriorityCount();
        }

        public async Task<List<Todo>> SearchAsync(string SearchText)
        {
            await VerifyAuthAsync();
            return await _repository.SearchAsync(SearchText);
        }

        public async Task<List<Todo>> GetTodosByUserIdAsync(string userId)
        {
            await VerifyAuthAsync();
            return await _repository.GetTodosByUserIdAsync(userId);
        }
    }
}