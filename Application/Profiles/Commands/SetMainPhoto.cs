using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Profiles.Commands
{
    public class SetMainPhoto
    {
        public class Command : IRequest<Result<Unit>>
    {
        public required string PhotoId { get; set; } = string.Empty;
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _context;

        public Handler(IUserAccessor userAccessor, DataContext context)
        {
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetUserWithPhotosAsync(cancellationToken);

            var photo = user.Photos.FirstOrDefault(x => x.Id.ToString() == request.PhotoId);
            if (photo == null) return Result<Unit>.Failure("Photo not found", StatusCodes.Status404NotFound);

            if (user.ImageUrl == photo.Url) return Result<Unit>.Failure("This is already your main photo", StatusCodes.Status400BadRequest);
            user.ImageUrl = photo.Url;
            
            var isSuccess = await _context.SaveChangesAsync(cancellationToken) > 0;

            return isSuccess ? 
                    Result<Unit>.Success(Unit.Value) 
                    : Result<Unit>.Failure("Problem deleting photo", StatusCodes.Status400BadRequest);
        }
    }
    }
}