using BackEnd.Common;
using BackEnd.Interfaces;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ILogger<ProjectController> _logger;

        public ProjectController(IProjectService projectService, ILogger<ProjectController> logger)
        {
            _projectService = projectService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ApiResponse<List<Project>>> GetAllAsync()
        {
            var response = new ApiResponse<List<Project>>();
            _logger.LogInformation("Get all projects API called");
            try
            {
                var projects = await _projectService.GetAllProjectsAsync();
                if (projects == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Projects not found"
                    });
                }
                else
                {
                    response.Result = projects;
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

        [HttpPost]
        public async Task<ApiResponse<string>> CreateAsync(Project project)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _projectService.CreateProjectAsync(project);
                response.Result = "Project Created";
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
        public async Task<ApiResponse<string>> Update(string id, Project project)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _projectService.UpdateProjectAsync(id, project);
                response.Result = "Project Updated";
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
                await _projectService.DeleteProjectAsync(id);
                response.Result = "Project Deleted";
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

        [HttpGet("SearchByUserId")]
        public async Task<ApiResponse<List<Project>>> GetProjectsByUserIdAsync(string userId)
        {
            var response = new ApiResponse<List<Project>>();
            try
            {
                var projects = await _projectService.GetProjectsByUserIdAsync(userId);
                if (projects == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "Projects not found"
                    });
                }
                else
                {
                    response.Result = projects;
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
    }
}
