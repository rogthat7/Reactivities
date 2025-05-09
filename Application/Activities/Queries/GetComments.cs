using Application.Activities.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;

public class GetComments
{
    public class Query : IRequest<Result<List<CommentDto>>>
    {
        public Guid ActivityId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
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

        public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var comments = await _dataContext.Comments
                .Include(c => c.User)
                .Where(c => c.ActivityId == request.ActivityId)
                .OrderByDescending(c => c.CreatedAt)
                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider, new { currentUserId = _userAccessor.GetUserId() })
                .ToListAsync(cancellationToken);

            return Result<List<CommentDto>>.Success(_mapper.Map<List<CommentDto>>(comments));
        }
    }
}
