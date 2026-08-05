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
    }
}