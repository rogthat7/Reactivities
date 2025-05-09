using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

public class FollowToggle 
{ 
    public class Command : IRequest<Result<Unit>>
    {
        public string TargetId { get; set; } = null!;
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _dataContext;

        public Handler(IUserAccessor userAccessor, DataContext dataContext)
        {
            _userAccessor = userAccessor;
            _dataContext = dataContext;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await _userAccessor.GetUserAsync();
            if (observer == null) return Result<Unit>.Failure("User not Logged in", StatusCodes.Status401Unauthorized);

            var target = await _dataContext.Users.FindAsync(request.TargetId, cancellationToken);
            if (target == null) return Result<Unit>.Failure("Target user not found", StatusCodes.Status400BadRequest);

            var following = await _dataContext.UserFollowings
                .SingleOrDefaultAsync(x => x.ObserverId == observer.Id && x.TargetId == target.Id, cancellationToken);

            if (following != null)
            {
                _dataContext.UserFollowings.Remove(following);
            }
            else
            {
                following = new UserFollowing
                {
                    ObserverId = observer.Id,
                    TargetId = target.Id
                };
                await _dataContext.UserFollowings.AddAsync(following, cancellationToken);
            }

            var result = await _dataContext.SaveChangesAsync(cancellationToken) > 0;
            if (result) return Result<Unit>.Success(Unit.Value);
            
            return Result<Unit>.Failure("Problem updating following", StatusCodes.Status400BadRequest);
        }
    }
}