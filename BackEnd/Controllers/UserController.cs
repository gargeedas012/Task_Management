using BackEnd.Common;
using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController: ControllerBase
    {
        private readonly IUserRepository _userService;
        public UserController(IUserRepository userService)
        {
            _userService = userService;
        }
        [HttpGet("GetProjectInfo")]
        public async Task<ApiResponse<ProjectCountDto>> GetProjectInfo(string UserId)
        {
            var response = new ApiResponse<ProjectCountDto>();
            try
            {
                var projectInfo = await _userService.GetProjectInfo(UserId);

                if (projectInfo == null)
                {
                    response.Errors.Add(new ApiError
                    {
                        Code = "404",
                        Message = "response not found"
                    });
                    return response;
                }
                else
                {
                    response.Result = projectInfo;
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
