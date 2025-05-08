using Application.Activities.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class AddComment
{
    public class Command : IRequest<Result<CommentDto>>
    {
        public Guid ActivityId { get; set; }
        public string Body { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>>
    {
        private readonly DataContext _dataContext;

        private readonly IUserAccessor _userAccessor;
        private readonly IMapper _mapper;

        public Handler(DataContext dataContext, IUserAccessor userAccessor, IMapper mapper)
        {
            _dataContext = dataContext;
            _userAccessor = userAccessor;
            _mapper = mapper;
        }

        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await _dataContext.Activities
                .Include(a => a.Comments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(a => a.Id == request.ActivityId, cancellationToken);

            if (activity == null) return Result<CommentDto>.Failure("Activity not found", StatusCodes.Status404NotFound);

            var user = await _userAccessor.GetUserAsync();

            var comment = new Comment
            {
                Body = request.Body,
                UserId = user.Id,
                ActivityId = request.ActivityId
            };

            activity.Comments.Add(comment);

            var result = await _dataContext.SaveChangesAsync() > 0;
            if (result)
            {
                return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));
            }
            return Result<CommentDto>.Failure("Problem adding comment", StatusCodes.Status400BadRequest);

        }
    }
}
