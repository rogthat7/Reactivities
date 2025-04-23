using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class CreateActivity 
    {
        public class Command : IRequest<Result <string>>
        {
            public CreateActivityDto ActivityDto { get; set; }
        }

            public class Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Command, Result<string>>
            {
                public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
                {
                    var user = await userAccessor.GetUserAsync();
                    if (user == null)
                    {
                        return Result<string>.Failure("User not found", 404);
                    }
                    var activity = mapper.Map<Activity>(request.ActivityDto);
                    context.Activities.Add(activity);

                    var attendee = new ActivityAttendee
                    {
                        UserId = user.Id,
                        ActivityId = activity.Id,
                        IsHost = true
                    };
                    activity.Attendees.Add(attendee);

                    var result = await context.SaveChangesAsync(cancellationToken) > 0;
                    if (!result)
                    {
                        return Result<string>.Failure("Failed to create activity", 422);
                    }
                    return Result<string>.Success(activity.Id.ToString());

                }
        }
    }
    
}