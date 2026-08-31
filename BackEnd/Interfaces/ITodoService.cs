using BackEnd.Models;
using BackEnd.DTOs;
namespace BackEnd.Interfaces
{
    public interface ITodoService
    {
        Task<List<Todo>> GetAllAsync();
        Task<Todo?> GetByIdAsync(string id);
        Task CreateAsync(CreateTodoDto createTodoDto);
        Task UpdateAsync(string id, UpdateTodoDto updateTodoDto);
        Task DeleteAsync(string id);
        Task<List<InCompleteTodoResponseDto>> GetIncompleteTodos(bool isCompleted);
        Task<List<PriorityCountDto>> GetPriorityCount();

        Task<List<Todo>> SearchAsync(string SearchText);
        Task<List<Todo>> GetTodosByUserIdAsync(string userId);
        Task<List<Todo>> GetTodosByProjectIdAsync(string projectId);
        Task<TodoListResponse> GetTodosByProjectIdWithLimit(string projectId, int page, int pageSize);
        Task<List<TodoByDateDto>> GetTodosByDateAsync(string projectId, DateTime startDate , int page, int pagesize , string filterType);
        Task<List<TodoResponse>> getRecentTodos(string UserId);
    }
}