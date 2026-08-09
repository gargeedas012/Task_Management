using BackEnd.Interfaces;
using BackEnd.Models;

namespace BackEnd.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }
        public Task CreateAsync(User user)
        {
            return _repository.CreateAsync(user);
        }
        public Task<User> GetByEmailAsync(string email)
        {
            return _repository.GetByEmailAsync(email);
        }

        public Task<User> GetByRefreshTokenAsync(string refreshToken)
        {
            return _repository.GetByRefreshTokenAsync(refreshToken);
        }

        public Task UpdateAsync(string id, User user)
        {
            return _repository.UpdateAsync(id, user);
        }
    }
}
