using Application.Activities.Commands;
using Application.Activities.Queries;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class CommentHub(IMediator mediator) : Hub
{
    public async Task SendComment(AddComment.Command command)
    {
        var comment = await mediator.Send(command);
        if (comment.IsSuccess)
        {
            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment.Data);
        }
        else
        {
            throw new CommentHubException(comment.Error);
        }
    }
   public override async Task OnConnectedAsync()
   {
        var httpContext = Context.GetHttpContext();
        var activityId = httpContext?.Request.Query["activityId"].ToString();
        if (string.IsNullOrEmpty(activityId))
        {
            throw new CommentHubException("Activity ID is required");
        }
        await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
        var result = await mediator.Send(new GetComments.Query { ActivityId = Guid.Parse(activityId) });
        if (result.IsSuccess)
        {
            await Clients.Caller.SendAsync("LoadComments", result.Data);
        }
        else
        {
            throw new CommentHubException(result.Error);
        }
   }
}
public class CommentHubException : Exception
{
    public CommentHubException(string message) : base(message)
    {
    }
}
