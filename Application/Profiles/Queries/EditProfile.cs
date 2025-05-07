using Application.Core;
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
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userProfile = await _context.Users.ProjectTo<UserProfile>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Id.ToString() == request.EditProfileDto.UserId, cancellationToken: cancellationToken);
                if (userProfile == null) return Result<Unit>.Failure("User Profile not found", StatusCodes.Status404NotFound);
                
                _mapper.Map(request.EditProfileDto, userProfile);
                
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update profile", StatusCodes.Status400BadRequest);
            }
        }
       
    }
}