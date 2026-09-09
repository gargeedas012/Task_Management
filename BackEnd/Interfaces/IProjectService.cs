using BackEnd.DTOs;
using BackEnd.Models;

namespace BackEnd.Interfaces
{
    public interface IProjectService
    {
        Task<List<Project>> GetAllProjectsAsync();
        Task CreateProjectAsync(Project project);
        Task UpdateProjectAsync(string id, Project project);
        Task DeleteProjectAsync(string id);
        Task<List<GetAllProjectsInfo>> GetProjectsByUserIdAsync(string userId);
        Task<List<ProjectResponseDto>> getRecentProjects(string UserId);
        Task<List<ProjectInfoDto>> GetProjectAssigneInfo(string userId);
        Task<List<ProjectIdNameInfo>> GetProjectsNameByUserIdAsync(string userId);
        Task<List<TeamMemberDto>> GetTeamMembersAsync(string projectId, string memberId);
    }
}