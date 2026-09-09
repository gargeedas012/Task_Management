using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;

namespace BackEnd.Services
{
    public class TodoService : ITodoService
    {
        private  readonly ITodoRepository _repository;

        public TodoService(ITodoRepository repository)
        {
            _repository = repository;
        }
        public async Task CreateAsync(Todo createTodoDto)
        {
            await _repository.CreateAsync(createTodoDto);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<List<Todo>> GetAllAsync()
        {
           return await _repository.GetAllAsync();
        }

        public async Task<Todo> GetByIdAsync(string id, string todoid)
        {
           return await _repository.GetByIdAsync(id,todoid);
        }

        public async Task UpdateAsync(string id, Todo updateTodoDto)
        {
            await _repository.UpdateAsync(id, updateTodoDto);
        }

        public async Task<List<InCompleteTodoResponseDto>> GetIncompleteTodos(bool isCompleted)
        {
            return await _repository.GetIncompleteTodos(isCompleted);
        }
        
        public async Task<List<PriorityCountDto>> GetPriorityCount(string UserId)
        {
            return await _repository.GetPriorityCount(UserId);
        }

        public async Task<List<Todo>> SearchAsync(string SearchText)
        {
            return await _repository.SearchAsync(SearchText);
        }

        public async Task<List<Todo>> GetTodosByUserIdAsync(string userId)
        {
            return await _repository.GetTodosByUserIdAsync(userId);
        }

        public async Task<List<Todo>> GetTodosByProjectIdAsync(string projectId)
        {
            return await _repository.GetTodosByProjectIdAsync(projectId);
        }

        public async Task<TodoListResponse> GetTodosByProjectIdWithLimit(string projectId, int page, int pageSize)
        {
            return await _repository.GetTodosByProjectIdWithLimit(projectId, page, pageSize);
        }

        public async Task<List<TodoByDateDto>> GetTodosByDateAsync(string projectId, DateTime startDate, int page, int pagesize , string filterType)
        {
            return await _repository.GetTodosByDateAsync(projectId, startDate ,  page,  pagesize , filterType);
        }

        public async Task<List<TodoResponse>> getRecentTodos(string UserId)
        {
            return await _repository.getRecentTodos(UserId);
        }
        public async  Task<TaskDashboardDto?> GetTaskInfo(string UserId)
        {
            return await _repository.GetTaskInfo(UserId);
        }

        public async Task<List<WeeklyActivityDto>> GetWeeklyActivity(string UserId)
        {
            return await _repository.GetWeeklyActivity(UserId);
        }

        public async Task<List<TaskPriorityGroupDto>> GetTaskPriorityGroup(string UserId, string? projectId)
        {
            return await _repository.GetTaskPriorityGroup(UserId,projectId);
        }
    }
}