using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure
{
    public class UserAccessor(IHttpContextAccessor httpContextAccessor, DataContext dataContext) : IUserAccessor
    {
        public string GetUserId()
        {
            return httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) 
                ?? throw new Exception("User not found in the context.");
        }

        public async Task<User> GetUserAsync()
        {
           return await dataContext.Users.FindAsync(GetUserId()) 
            ?? throw new UnauthorizedAccessException("User not found in the database.");
            
        }
    }
}