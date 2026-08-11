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
        public async Task<ActionResult<ApiResponse<List<Project>>>> GetAllAsync()
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
                    return NotFound();
                }
                else
                {
                    response.Result = projects;
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

        [HttpPost]
        public async Task<ActionResult<ApiResponse<string>>> CreateAsync(Project project)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _projectService.CreateProjectAsync(project);
                response.Result = "Project Created";
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
                return Unauthorized(response);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> Update(string id, Project project)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _projectService.UpdateProjectAsync(id, project);
                response.Result = "Project Updated";
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
                return Unauthorized(response);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> Delete(string id)
        {
            var response = new ApiResponse<string>();
            try
            {
                await _projectService.DeleteProjectAsync(id);
                response.Result = "Project Deleted";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.Status=false;
                response.Errors.Add(new ApiError
                {
                    Code = "500",
                    Message = ex.Message
                });
                return Unauthorized(response);
            }
        }

        [HttpGet("SearchByUserId")]
        public async Task<ActionResult<ApiResponse<List<Project>>>> GetProjectsByUserIdAsync(string userId)
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
                    return NotFound();
                }
                else
                {
                    response.Result = projects;
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
    }
}
