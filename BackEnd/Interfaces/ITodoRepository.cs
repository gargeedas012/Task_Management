using BackEnd.DTOs;
using BackEnd.Models;

namespace BackEnd.Interfaces
{
    public interface ITodoRepository
    {
        Task<List<Todo>> GetAllAsync();
        Task<Todo?> GetByIdAsync(string id);
        Task CreateAsync(Todo todo);
        Task UpdateAsync(string id, Todo todo);
        Task DeleteAsync(string id);
        Task<List<InCompleteTodoResponseDto>> GetIncompleteTodos(bool isCompleted);
        Task<List<PriorityCountDto>> GetPriorityCount();
        Task<List<Todo>> SearchAsync(string SearchText);
        Task<List<Todo>> GetTodosByUserIdAsync(string userId);
        Task<List<Todo>> GetTodosByProjectIdAsync(string projectId);
        Task<TodoListResponse> GetTodosByProjectIdWithLimit(string projectId, int page, int pageSize);
        Task<List<TodoByDateDto>> GetTodosByDateAsync(string projectId, DateTime startDate ,int page, int pagesize , string filterType);
        Task<List<TodoResponse>> getRecentTodos(string UserId);
        Task<TaskDashboardDto?> GetTaskInfo(string UserId);
    }
}