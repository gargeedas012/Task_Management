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
    }
}