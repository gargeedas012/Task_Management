using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;

namespace BackEnd.Services
{
    public class TodoService : ITodoService
    {
        private  readonly ITodoRepository _repository;

        public TodoService(ITodoRepository repository)
        {
            _repository = repository;
        }

        public Task CreateAsync(CreateTodoDto createTodoDto)
        {
            var todo = new Todo
            {
                Title = createTodoDto.Title,
                Description = createTodoDto.Description,
                Priority = createTodoDto.Priority,
                DueDate = createTodoDto.DueDate,
                Category = createTodoDto.Category,
                IsCompleted = createTodoDto.IsCompleted,
                CreatedDate = DateTime.UtcNow
            };
            return _repository.CreateAsync(todo);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<List<Todo>> GetAllAsync()
        {
           return await _repository.GetAllAsync();
        }

        public async Task<Todo?> GetByIdAsync(string id)
        {
           return await _repository.GetByIdAsync(id);
        }

        public async Task UpdateAsync(string id, UpdateTodoDto updateTodoDto)
        {
            var todo = new Todo
            {
                Id = id,
                Title = updateTodoDto.Title,
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
            return await _repository.GetIncompleteTodos(isCompleted);
        }
        public Task<List<PriorityCountDto>> GetPriorityCount()
        {
            return _repository.GetPriorityCount();
        }

        public Task<List<Todo>> SearchAsync(string SearchText)
        {
            return _repository.SearchAsync(SearchText);
        }
    }
}