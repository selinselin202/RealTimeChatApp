using Microsoft.AspNetCore.SignalR;

namespace RealTimeChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task JoinRoom(string room)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, room);
        }

        public async Task SendMessage(string room, string user, string message, string messageId)
        {
            await Clients.Group(room).SendAsync(
                "ReceiveMessage",
                user,
                message,
                messageId
            );
        }

        public async Task DeleteMessage(string room, string messageId)
        {
            await Clients.Group(room).SendAsync(
                "MessageDeleted",
                messageId
            );
        }
    }
}
