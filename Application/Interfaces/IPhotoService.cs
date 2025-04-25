using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoService
    {
        Task<PhotoUploadResult?> AddPhotoAsync(IFormFile file);
        Task<PhotoUploadResult> EditPhotoAsync(IFormFile file, string publicId);
        Task<string> DeletePhotoAsync(string publicId);
    }
}