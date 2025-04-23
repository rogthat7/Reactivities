using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands
{
    public class UpdateAttendence
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required Guid Id { get; set; }
            public bool IsGoing { get; set; }
        }
        public class Handler(IUserAccessor userAccessor, DataContext dataContext) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await dataContext.Activities
                .Include(a => a.Attendees)
                .ThenInclude(a => a.User)
                .SingleOrDefaultAsync(a => a.Id == request.Id, cancellationToken: cancellationToken);
                if (activity == null) return Result<Unit>.Failure("Activity not found",404);
                var user = await userAccessor.GetUserAsync();
                var attendence = activity.Attendees.FirstOrDefault(a => a.UserId == user.Id);
                var isHost = activity.Attendees.Any(a => a.IsHost && a.UserId == user.Id);
                if(attendence != null)
                {
                    if(isHost) activity.IsCancelled = !activity.IsCancelled;
                    else activity.Attendees.Remove(attendence);

                }
                else
                {
                    activity.Attendees.Add(new ActivityAttendee
                    {
                        UserId = user.Id,
                        Activity = activity,
                        IsHost = false
                    });
                }
                if (await dataContext.SaveChangesAsync(cancellationToken) > 0)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Failed to update attendence", 500);
            }
        }
    }
}