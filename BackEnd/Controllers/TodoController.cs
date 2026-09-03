using BackEnd.Common;
using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;
using static Google.Apis.Requests.BatchRequest;

namespace BackEnd.Controllers
{
    [Authorize]
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
        public async Task<ActionResult<ApiResponse<Todo>>> GetByIdAsync(string id)
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
                    return NotFound();
                }
                else
                {
                    response.Result = task;
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                response.Status = false;
                _logger.LogError(ex, "Error While Getting all todos");
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return BadRequest(response);
            }
        }
        [HttpPost]
        public async Task<ActionResult<ApiResponse<string>>> CreateAsync(Todo todo)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _todoService.CreateAsync(todo);
                response.Result = "Todo Created";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return BadRequest(response);
            }
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> Update(string id, UpdateTodoDto dto)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _todoService.UpdateAsync(id, dto);
                response.Result = "Todo Updated";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return BadRequest(response);
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> Delete(string id)
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
        public async Task<ApiResponse<List<PriorityCountDto>>> GetPriorityCount(string UserId)
        {
            var response = new ApiResponse<List<PriorityCountDto>>();
            try
            {
                var task = await _todoService.GetPriorityCount(UserId);
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
        [HttpGet("GetTodosByProjectId")]
        public async Task<ActionResult<ApiResponse<List<Todo>>>> GetTodosByProjectIdAsync(string projectId)
        {
            var response=new ApiResponse<List<Todo>>();
            try
            {
                var task = await _todoService.GetTodosByProjectIdAsync(projectId);
                if (task == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return NotFound();
                }
                else
                {
                    response.Result = task;
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return Unauthorized(response);
            }
        }

        [HttpGet("Search")]
        public async Task<ActionResult<ApiResponse<List<Todo>>>> Search(string searchText)
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
        public async Task<ActionResult<ApiResponse<List<Todo>>>> GetTodosByUserIdAsync(string userId)
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
        [HttpGet("TodosByProjectIdWithLimit")]
        public async Task<ActionResult<ApiResponse<TodoListResponse>>> GetTodosByProjectIdWithLimit(string projectId, int page, int pageSize)
        {
            var response=new ApiResponse<TodoListResponse>();
            try
            {
                var task=await _todoService.GetTodosByProjectIdWithLimit(projectId, page, pageSize);
                if(task == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return NotFound();
                }
                else
                {
                    response.Result = task;
                    return Ok(response);
                }
            }catch(Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return BadRequest(response);
            }
            
        }
        [HttpGet("TodosByDate")]
        public async Task<ActionResult<ApiResponse<List<TodoByDateDto>>>> GetTodosByDateAsync(string projectId, DateTime startDate, int page, int pagesize, string filterType)
        {
            var response = new ApiResponse<List<TodoByDateDto>>();
            try
            {
                var task = await _todoService.GetTodosByDateAsync(projectId, startDate , page ,pagesize, filterType);
                if( task == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return NotFound();
                }
                else
                {
                    response.Result = task;
                    return Ok(response);
                }
            }
            catch(Exception ex)
            {
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return BadRequest(response);
            }
        }

        [HttpGet("getRecentTodos")]
        public async Task<ActionResult<List<TodoResponse>>> getRecentTodos(string UserId)
        {
            var resposne = new ApiResponse<List<TodoResponse>>();
            try
            {
                var result= await _todoService.getRecentTodos(UserId);
                if (result == null)
                {
                    resposne.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return NotFound();
                }
                else
                {
                    resposne.Result = result;
                    return Ok(resposne);
                }
            }
            catch (Exception ex)
            {
                resposne.Errors.Add(new ApiError
                {
                   
                    Message = ex.Message
                });
                return BadRequest(resposne);
            }

        }
        [HttpGet("GetTaskInfo")]
       public async  Task<ActionResult<TaskDashboardDto>> GetTaskInfo(string UserId)
        {
            var resposne = new ApiResponse<TaskDashboardDto>();
            try
            {
                var result = await _todoService.GetTaskInfo(UserId);
                if (result == null)
                {
                    resposne.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return NotFound();
                }
                else
                {
                    resposne.Result = result;
                    return Ok(resposne);
                }
            }
            catch (Exception ex)
            {
                resposne.Errors.Add(new ApiError
                {

                    Message = ex.Message
                });
                return BadRequest(resposne);
            }
        }
        [HttpGet("GetWeeklyActivity")]
        public async Task<ActionResult<List<WeeklyActivityDto>>> GetWeeklyActivity(string UserId)
        {
            var resposne = new ApiResponse<List<WeeklyActivityDto>>();
            try
            {
                var result = await _todoService.GetWeeklyActivity(UserId);
                if (result == null)
                {
                    resposne.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Task not found"
                    });
                    return NotFound();
                }
                else
                {
                    resposne.Result = result;
                    return Ok(resposne);
                }
            }
            catch (Exception ex)
            {
                resposne.Errors.Add(new ApiError
                {

                    Message = ex.Message
                });
                return BadRequest(resposne);
            }
        }

    }
}