using BackEnd.Common;
using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;
        private readonly ILogger<TodoController> _logger;
        public  TodoController(ITodoService service, ILogger<TodoController> logger)
        {
            _todoService = service;
            _logger = logger;
        }
        [HttpGet]
        public async Task<ApiResponse<List<Todo>>> GetAllAsync()
        {
            var response = new ApiResponse<List<Todo>>();
            _logger.LogInformation("Get all todos API called");
            try
            {
                var task = await _todoService.GetAllAsync();

                if (task == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return response;
                }
                else
                {
                    response.Result = task;
                }
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }
            return response;
        }
        [HttpGet("{id}")]
        public async Task<ApiResponse<Todo>> GetByIdAsync(string id)
        {
            var response = new ApiResponse<Todo>();
            _logger.LogWarning("No Todo Record Found");
            try
            {
                var task = await _todoService.GetByIdAsync(id);
                if (task == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return response;
                }
                else
                {
                    response.Result = task;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error While Getting all todos");
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }
            return response;
            //var result= await _todoService.GetByIdAsync(id);
            //if(result==null)
            //    return NotFound();
            //return Ok(result);
        }
        [HttpPost]
        public async Task<ApiResponse<string>> CreateAsync(CreateTodoDto dto)
        {
            var response = new ApiResponse<string>();

            try
            {
                await _todoService.CreateAsync(dto);

                response.Result = "Todo Created";
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }

            return response;
        }
        [HttpPut("{id}")]
        public async Task<ApiResponse<string>> Update(string id, UpdateTodoDto dto)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _todoService.UpdateAsync(id, dto);
                response.Result = "Todo Updated";
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }
            return response;
        }
        [HttpDelete("{id}")]
        public async Task<ApiResponse<string>> Delete(string id)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _todoService.DeleteAsync(id);
                response.Result = "Todo Deleted";
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }
            return response;
        }
        [HttpGet("GetIncompleteTodos")]
        public async Task<ApiResponse<List<InCompleteTodoResponseDto>>> GetIncompleteTodos(bool isCompleted)
        {
            var response = new ApiResponse<List<InCompleteTodoResponseDto>>();
            try
            {
                var task = await _todoService.GetIncompleteTodos(isCompleted);
                if (task == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return response;
                }
                else
                {
                    response.Result = task;
                }
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }
            return response;
        }
        [HttpGet("GetPriorityCount")]
        public async Task<ApiResponse<List<PriorityCountDto>>> GetPriorityCount()
        {
            var response = new ApiResponse<List<PriorityCountDto>>();
            try
            {
                var task = await _todoService.GetPriorityCount();
                if (task == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return response;
                }
                else
                {
                    response.Result = task;
                }
            }
            catch (Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }
            return response;
        }

        [HttpGet("Search")]
        public async Task<ApiResponse<List<Todo>>> Search(string searchText)
        {
           var response= new ApiResponse<List<Todo>>();
            try
            {
                var task= await _todoService.SearchAsync(searchText);
                if (task == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return response;
                }
                else
                {
                    response.Result = task;
                }
            }
            catch(Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }
            return response;            
        }
        [HttpGet("SearchByUserId")]
        public async Task<ApiResponse<List<Todo>>> GetTodosByUserIdAsync(string userId)
        {
            var response = new ApiResponse<List<Todo>>();
            try
            {
                var task=await _todoService.GetTodosByUserIdAsync(userId);
                if(task == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return response;
                }
                else
                {
                    response.Result = task;
                }
            }catch(Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
            }
            return response;
        }


    }
}