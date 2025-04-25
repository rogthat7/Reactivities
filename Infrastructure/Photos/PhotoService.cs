using Application.Interfaces;
using Application.Profiles.DTOs;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace Infrastructure.Photos
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;
        public PhotoService(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
            _cloudinary = new Cloudinary(acc);
        }
        public async Task<PhotoUploadResult?> AddPhotoAsync(IFormFile file)
        {
            if(file.Length > 0){
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    // Transformation = new Transformation().Height(500).Width(500).Crop("fill"),
                    Folder = "Reactivities2025" // Specify your folder name if needed
                };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }
                return new PhotoUploadResult
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString()
                };
            }
            return null;
        }

        public async Task<string> DeletePhotoAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId)
            {
                ResourceType = ResourceType.Image
            };
            var result = await _cloudinary.DestroyAsync(deleteParams);
            if(result.Error != null)
            {
                throw new Exception(result.Error.Message);
            }
            return result.Result == "ok" ? "Photo deleted successfully" : "Photo deletion failed";
        }

        public Task<PhotoUploadResult> EditPhotoAsync(IFormFile file, string publicId)
        {
            throw new NotImplementedException();
        }
    }
}