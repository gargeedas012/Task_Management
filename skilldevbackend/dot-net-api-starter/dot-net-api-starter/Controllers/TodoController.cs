using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projects.Dtos.Task;
using Projects.Services.TaskTodo;

namespace Projects.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly TodoService _todoService;
        public TodoController(TodoService service)
        {
            _todoService = service;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _todoService.GetAllAsync();
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(string id)
        {
            var result = await _todoService.GetByIdAsync(id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateTodoDto dto)
        {
            await _todoService.CreateAsync(dto);
            return Ok(
                new
                {
                    message = "Todo Created"
                });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, UpdateTodoDto dto)
        {
            await _todoService.UpdateAsync(id, dto);
            return Ok(
                new
                {
                    message = "Todo Updated"
                });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {

            await _todoService.DeleteAsync(id);
            return Ok(
                new
                {
                    message = "Todo Deleted"
                });
        }

        [HttpGet("GetIncompleteTodos")]
        public async Task<IActionResult> GetIncompleteTodos(bool isCompleted)
        {
            var result= await _todoService.GetIncompleteTodos(isCompleted);
            return Ok(result);
        }

        [HttpGet("GetPriorityCount")]
        public async Task<IActionResult> GetPriorityCount()
        {
            var result=await _todoService.GetPriorityCount();
            return Ok(result);
        }
    }
}
