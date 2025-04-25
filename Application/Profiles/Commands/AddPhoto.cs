using System.ComponentModel.DataAnnotations;
using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Profiles.Commands;

public class AddPhoto
{
    public class Command : IRequest<Result<Photo?>>
    {
        [Required]
        public IFormFile File { get; set; } = null!;
    }

    public class Handler : IRequestHandler<Command, Result<Photo?>>
    {
        private readonly IPhotoService _photoService;
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _dataContext;


        public Handler(IPhotoService photoService, IUserAccessor userAccessor, DataContext dataContext)
        {
            _photoService = photoService;
            _userAccessor = userAccessor;
            _dataContext = dataContext;

        }

        public async Task<Result<Photo?>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _userAccessor.GetUserAsync();
            if (user == null) return Result<Photo?>.Failure("User not Logged in", StatusCodes.Status401Unauthorized);

            var uploadResult = await _photoService.AddPhotoAsync(request.File);
            if (uploadResult == null) return Result<Photo?>.Failure("Error uploading photo", StatusCodes.Status400BadRequest);

            var photo = new Photo
            {
                Url = uploadResult.Url,
                PublicId = uploadResult.PublicId,
                UserId = user.Id
            };

            user.ImageUrl ??= photo.Url;
            _dataContext.Photos.Add(photo);

            var result = await _dataContext.SaveChangesAsync(cancellationToken) > 0;
            if (result)
            {
                return Result<Photo?>.Success(photo);
            }
            return Result<Photo?>.Failure("Error saving photo to database", StatusCodes.Status400BadRequest);
            
        }
    }
}
