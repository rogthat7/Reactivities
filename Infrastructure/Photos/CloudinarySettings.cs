using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Photos
{
    public class CloudinarySettings
    {
        public required string CloudName { get; set; }
        public required string ApiKey { get; set; }
        public required string ApiSecret { get; set; }
        public required string ApiUrl { get; set; } = "https://api.cloudinary.com/v1_1/{0}/image/upload";
    }
}