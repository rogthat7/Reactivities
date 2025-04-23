using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class IsHostRequirement : IAuthorizationRequirement
{
}
public class IsHostRequirementHandler(DataContext dataContext, IHttpContextAccessor httpContextAccessor) 
: AuthorizationHandler<IsHostRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            context.Fail(); return;
        }
        if (!Guid.TryParse(httpContextAccessor.HttpContext?.Request.RouteValues["id"].ToString(), out var activityId))
        {
            context.Fail(); return;
        }
        var attendee = await dataContext.ActivityAttendees
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.ActivityId == activityId && x.UserId == userId);
        if (attendee == null)
        {
            context.Fail(); return;
        }
        if (attendee.IsHost)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail(); return;
        }
    }
}
