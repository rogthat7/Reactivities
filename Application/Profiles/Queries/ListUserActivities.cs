using Application.Core;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries
{
    public class ListUserActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>> 
        {
            public required string Id { get; set; }
            public required string Filter { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _dataContext;

            public Handler( IMapper mapper, DataContext dataContext)
            {
                _mapper = mapper;
                _dataContext = dataContext;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                 var query = _dataContext.Activities
                .OrderBy(x => x.Date)
                .AsQueryable();

                if(!string.IsNullOrEmpty(request.Filter)){
                    query = request.Filter switch{
                        "past" => query.Where(x => x.Date < DateTime.UtcNow && x.Attendees.Any(a=>a.UserId == request.Id )),
                        "hosting" => query.Where(x => x.Attendees.Any(a=>a.IsHost && a.UserId == request.Id )),
                        _ => query.Where(x => x.Attendees.Any(a=>a.UserId == request.Id) && x.Date >= DateTime.UtcNow )
                    };
                }

                var activities = query.ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, new { currentUserId = request.Id })
                .ToListAsync(cancellationToken);

                return Result<List<UserActivityDto>>.Success(await activities);
                
            }
        }
    }
}