using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class EditProfile
    {
        public class Command : IRequest<Result  <Unit>>
        {
            public EditProfileDto EditProfileDto { get; set; } 
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userAccessor.GetUserAsync();
                user.DisplayName = request.EditProfileDto.DisplayName;
                user.Bio = request.EditProfileDto.Bio;
                _context.Entry(user).State = EntityState.Modified;
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Failed to update profile", 400);
            }
        }
       
    }
}