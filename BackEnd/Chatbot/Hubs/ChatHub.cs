using BackEnd.Chatbot.Service;
using Microsoft.AspNetCore.SignalR;

namespace BackEnd.Chatbot.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatService _chatService;
        public ChatHub(ChatService chatService)
        {
            _chatService = chatService;
        }
        private string? GetUserId()
        {
            return Context.User?.FindFirst("userId")?.Value;
        }
        public async Task JoinProject(string projectId)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new HubException("User is not authenticated.");
            }
            var isMember=await _chatService.IsProjectMemberAsync(projectId, userId);
            if (!isMember)
            {
                throw new HubException(
                    "You are not a member of this project.");
            }
            var groupName = $"project-{projectId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeaveProject(string projectId)
        {
            var groupName = $"project-{projectId}";
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task SendMessage(string projectId, string text)
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new HubException("User is not authenticated.");
            }
            var message = await _chatService.SendMessageAsync(projectId, userId, text);
            var groupName = $"project-{projectId}";
            await Clients.Group(groupName).SendAsync("ReceiveMessage", message);
        }
    }
}
