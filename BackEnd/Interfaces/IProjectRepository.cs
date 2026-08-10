using BackEnd.Models;

namespace BackEnd.Interfaces
{
    public interface IProjectRepository
    {
        Task<List<Project>> GetAllProjectsAsync();
        Task CreateProjectAsync(Project project);
        Task UpdateProjectAsync(string id, Project project);
        Task DeleteProjectAsync(string id);
        Task<List<Project>> GetProjectsByUserIdAsync(string userId);
    }
}
