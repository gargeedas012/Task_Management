using BackEnd.Chatbot.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Chatbot.Controller
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;

        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetProjectMessages(
            string projectId , string userId)
        {
            try
            {

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var messages = await _chatService
                    .GetProjectMessagesAsync(projectId, userId);

                return Ok(messages);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
