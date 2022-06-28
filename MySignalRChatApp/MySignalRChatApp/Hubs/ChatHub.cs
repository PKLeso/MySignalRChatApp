using Microsoft.AspNetCore.SignalR;

namespace MySignalRChatApp.Hubs
{
    public class ChatHub : Hub
    {
        // The ChatHub class inherits from the SignalR Hub class
        // The Hub class manages connections, groups, and messaging
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
