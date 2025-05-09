using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetFollowings
{
    public class Query : IRequest<Result<List<UserProfile>>>
    {
        public string UserId { get; set; } = string.Empty;
        public string Predicate { get; set; } = "followers";
    }

    public class Handler : IRequestHandler<Query, Result<List<UserProfile>>>
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;


        public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
        {
            _dataContext = dataContext;
            _mapper = mapper;
            _userAccessor = userAccessor;

        }

        public async Task<Result<List<UserProfile>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<UserProfile>();
            switch (request.Predicate)
            {
                case "followers":
                    profiles = await _dataContext.UserFollowings.Where(x => x.TargetId == request.UserId)
                        .Select(x => x.Observer)
                        .ProjectTo<UserProfile>(_mapper.ConfigurationProvider
                            , new { currentUserId = _userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
                case "followings":
                    profiles = await _dataContext.UserFollowings.Where(x => x.ObserverId == request.UserId)
                        .Select(x => x.Target)
                        .ProjectTo<UserProfile>(_mapper.ConfigurationProvider
                            , new { currentUserId = _userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
                default:
                    throw new Exception("Invalid predicate");
            }
            return Result<List<UserProfile>>.Success(profiles);
        }
    }
}
