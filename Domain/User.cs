using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class User : IdentityUser
    {
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? ImageUrl { get; set; }

        // nav properties
        public ICollection<ActivityAttendee> Activities { get; set; } = [];
        public ICollection<Photo> Photos { get; set; } = [];
        public ICollection<UserFollowing> Followers { get; set; } = []; //Follwers
        public ICollection<UserFollowing> Followings { get; set; } = []; //Followings
    }
}