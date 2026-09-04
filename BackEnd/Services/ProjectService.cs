using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _repository;
        public ProjectService( IProjectRepository repository)
        {
            _repository = repository;
        }
        public async Task CreateProjectAsync(Project project)
        {
            project.CreatedDate = DateTime.UtcNow;
            await _repository.CreateProjectAsync(project);
        }

        public async Task DeleteProjectAsync(string id)
        {
            await _repository.DeleteProjectAsync(id);
        }

        public async Task<List<Project>> GetAllProjectsAsync()
        {
            return await _repository.GetAllProjectsAsync();
        }

        public async Task<List<Project>> GetProjectsByUserIdAsync(string userId)
        {
            return await _repository.GetProjectsByUserIdAsync(userId);
        }

        public async Task UpdateProjectAsync(string id, Project project)
        {
            project.Id = id;
            await _repository.UpdateProjectAsync(id, project);
        }

        public async Task<List<ProjectResponseDto>> getRecentProjects(string UserId)
        {
            return await _repository.getRecentProjects(UserId);
        }

        public async Task<List<ProjectInfoDto>> GetProjectAssigneInfo(string userId)
        {
            return await _repository.GetProjectAssigneInfo(userId);
        }

        public async Task<List<ProjectIdNameInfo>> GetProjectsNameByUserIdAsync(string userId)
        {
            return await _repository.GetProjectsNameByUserIdAsync(userId);
        }
    }
}
