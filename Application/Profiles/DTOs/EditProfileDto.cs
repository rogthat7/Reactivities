using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Profiles.DTOs
{
    public class EditProfileDto
    {
        public required string DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? UserId { get; set; }
    }
}