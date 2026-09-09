using BackEnd.DTOs;
using BackEnd.Models;

namespace BackEnd.Interfaces
{
    public interface IUserService
    {
        Task CreateAsync(User user);
        Task<User> GetByEmailAsync(string email);
        Task UpdateAsync(string id, User user);
        Task<User> GetByRefreshTokenAsync(string refreshToken);
        Task<ProjectCountDto> GetProjectInfo(string UserId);
    }
}
