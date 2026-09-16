using BackEnd.Chatbot.DTO;
using BackEnd.Interfaces;
using BackEnd.Models;
using BackEnd.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BackEnd.Chatbot.Service
{
    public class ChatService
    {
        private readonly IMongoCollection<Message> _messagesCollection;
        private readonly IProjectService _projectService;
        private readonly IUserService _userService;
        public ChatService(IOptions<TodoDatabaseSettings> databaseSettings, IProjectService projectService, IUserService userService)
        {
            var client = new MongoClient(databaseSettings.Value.ConnectionString);
            var database = client.GetDatabase(databaseSettings.Value.DatabaseName);
            _messagesCollection = database.GetCollection<Message>(databaseSettings.Value.MessageCollectionName);
            _projectService = projectService;
            _userService = userService;
        }
        public async Task<List<MessageResponseDto>> GetProjectMessagesAsync(string projectId, string userId)
        {
            var project = await _projectService.GetProjectInfo(projectId);
            if (project == null)
            {
                throw new Exception("Project is not found");
            }
            var isMember = project.ProjectManagerId == userId || project.ProjectMemberId.Contains(userId);
            if (!isMember)
            {
                throw new UnauthorizedAccessException("you are not the project memener");
            }
            var messages = await _messagesCollection.Find(x => x.ProjectId == projectId).SortBy(x => x.CreatedAt).ToListAsync();
            return messages.Select(x => new MessageResponseDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                SenderId = x.SenderId,
                SenderName = x.SenderName,
                SenderProfileImage = x.SenderProfileImage,
                Text = x.Text,
                CreatedAt = x.CreatedAt,
                IsEdited = x.IsEdited,
                IsDeleted = x.IsDeleted
            }).ToList();
        }
        public async Task<bool> IsProjectMemberAsync(string projectId, string userId)
        {
            var project = await _projectService.GetProjectInfo(projectId);
            if (project == null)
            {
                return false;
            }
            return project.ProjectManagerId == userId ||
                   (project.ProjectMemberId != null &&
                    project.ProjectMemberId.Contains(userId));
        }
        public async Task<MessageResponseDto> SendMessageAsync(string projectId, string userId, string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                throw new ArgumentException("Message cannot be empty");
            }
            var isMember = await IsProjectMemberAsync(projectId, userId);
            if (!isMember)
            {
                throw new UnauthorizedAccessException("you are not the project memener");
            }
            var user = await _userService.GetUserInfo(userId);
            if (user == null)
            {
                throw new Exception("User not found.");
            }
            var message = new Message
            {
                ProjectId = projectId,
                SenderId = userId,
                SenderName = user.Username,
                SenderProfileImage = user.ProfilePicUrl,
                Text = text.Trim(),
                CreatedAt = DateTime.UtcNow,
                IsEdited = false,
                IsDeleted = false
            };
            await _messagesCollection.InsertOneAsync(message);
            return new MessageResponseDto
            {
                Id = message.Id,
                ProjectId = message.ProjectId,
                SenderId = message.SenderId,
                SenderName = message.SenderName,
                SenderProfileImage = message.SenderProfileImage,
                Text = message.Text,
                CreatedAt = message.CreatedAt,
                IsEdited = message.IsEdited,
                IsDeleted = message.IsDeleted
            };
        }
    }
}
