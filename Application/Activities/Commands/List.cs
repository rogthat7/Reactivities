using Application.Activities.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        private const int MaxPageSize = 50;
        public class Query :IRequest<Result<PagedList<ActivityDto,DateTime?>>>
        {
            public DateTime? Cursor { get; set; }
            private int _pageSize = 3;
            public int PageSize { get => _pageSize; set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
            
        }
        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto,DateTime?>>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<PagedList<ActivityDto,DateTime?>>> Handle(Query request, CancellationToken cancellationToken) 
            {
                var query = _context.Activities
                .OrderBy(x => x.Date)
                .AsQueryable();

                if(request.Cursor.HasValue){
                    query = query.Where(x => x.Date > request.Cursor.Value);
                }
                var activities = await query
                .Take(request.PageSize + 1)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUserId = _userAccessor.GetUserId() })
                .ToListAsync(cancellationToken);

                DateTime? nextCursor = null;
                if (activities.Count > request.PageSize)
                {
                    nextCursor = activities[request.PageSize - 1].Date;
                    activities.RemoveRange(request.PageSize, activities.Count - request.PageSize);
                }
                return Result<PagedList<ActivityDto,DateTime?>>.Success(
                    new PagedList<ActivityDto,DateTime?>{
                        Items = activities,
                        NextCursor = nextCursor
                    }
                );
                
            }
        }
    }
}