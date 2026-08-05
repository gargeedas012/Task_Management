using BackEnd.DTOs;
using BackEnd.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;
        public  TodoController(ITodoService service)
        {
            _todoService = service;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var result= await _todoService.GetAllAsync();
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(string id)
        {
            var result= await _todoService.GetByIdAsync(id);
            if(result==null)
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
        public async Task<IActionResult> Update(string id,UpdateTodoDto dto)
        {
            await _todoService.UpdateAsync(id,dto);
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
    }
}