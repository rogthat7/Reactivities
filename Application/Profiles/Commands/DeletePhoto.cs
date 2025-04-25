using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

public class DeletePhoto {
    public class Command : IRequest<Result<Unit>>
    {
        public required string PhotoId { get; set; } = string.Empty;
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly IPhotoService _photoService;
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _context;

        public Handler(IPhotoService photoService, IUserAccessor userAccessor, DataContext context)
        {
            _photoService = photoService;
            _userAccessor = userAccessor;
            _context = context;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetUserWithPhotosAsync(cancellationToken);

            var photo = user.Photos.FirstOrDefault(x => x.Id.ToString() == request.PhotoId);
            if (photo == null) return Result<Unit>.Failure("Photo not found", StatusCodes.Status404NotFound);

            if (user.ImageUrl == photo.Url) return Result<Unit>.Failure("Cannot delete main photo", StatusCodes.Status400BadRequest);
            
            var result = await _photoService.DeletePhotoAsync(photo.PublicId);

            user.Photos.Remove(photo);

            var isSuccess = await _context.SaveChangesAsync(cancellationToken) > 0;

            return isSuccess ? 
                    Result<Unit>.Success(Unit.Value) 
                    : Result<Unit>.Failure("Problem deleting photo", StatusCodes.Status400BadRequest);
        }
    }
}