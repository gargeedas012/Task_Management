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
    }
}