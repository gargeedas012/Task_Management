using Capsitech;
using Capsitech.Data.Models;
using Capsitech.Data.MongoDB;
using Capsitech.Extensions;
using Capsitech.Storage;
using Capsitech.Utility;
using Projects.Common;
using Projects.Identity;
using Projects.Models;
using Projects.Services;
using Projects.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Projects.Controllers
{
    [Route("/API/Task")]
    public class TaskController : ApiControllerBase
    {
        private readonly ILogger<TaskController> _logger;
        private readonly TaskService _taskService;

        public TaskController(ILogger<TaskController> logger, DBConfiguration dbConfig, TaskService taskService) : base(dbConfig)
        {
            _logger = logger;
            _taskService = taskService;
        }

        [HttpPost("SaveTask")]
        [AllowAnonymous]
        public async Task<ApiResponse<TaskItem>> SaveTask([FromBody] SaveTaskReq model)
        {
            var response = new ApiResponse<TaskItem>();
            try
            {
                response.Result = await _taskService.SaveTaskAsync(model, User);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving task");
                response.AddError(ex.Message);
            }
            return response;
        }

        [HttpGet("GetTask")]
        [AllowAnonymous]
        public async Task<ApiResponse<TaskItem>> GetTask(string id)
        {
            var response = new ApiResponse<TaskItem>();
            try
            {
                response.Result = await _taskService.GetTaskAsync(id, User);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting task");
                response.AddError(ex.Message);
            }
            return response;
        }

        [HttpGet("TaskList")]
        [AllowAnonymous]
        public async Task<ApiResponse<PagedData<TaskItem>>> GetTaskList([FromQuery] TaskSearchReq model)
        {
            var response = new ApiResponse<PagedData<TaskItem>> { Result = new PagedData<TaskItem>() };
            try
            {
                response.Result = await _taskService.GetTaskListAsync(model, User);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting task list");
                response.AddError(ex.Message);
            }
            return response;
        }

        [HttpDelete("DeleteTask")]
        [AllowAnonymous]
        public async Task<ApiResponse<bool>> DeleteTask(string id)
        {
            var response = new ApiResponse<bool>();
            try
            {
                var result = await _taskService.DeleteTaskAsync(id, User);
                response.Result = result;
                response.Status = result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting task");
                response.AddError(ex.Message);
            }
            return response;
        }
    }
}
