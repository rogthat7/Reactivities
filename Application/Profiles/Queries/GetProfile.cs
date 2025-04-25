using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries
{
    public class GetProfile
    {
        public class Query : IRequest<Result<UserProfile>>
        {
            public required string UserId { get; set; } = string.Empty;
        }

        public class Handler : IRequestHandler<Query, Result<UserProfile>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
    
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _dataContext = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<UserProfile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profile = await _dataContext.Users
                    .ProjectTo<UserProfile>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x => x.Id.ToString() == request.UserId, cancellationToken: cancellationToken);
                return profile == null ? 
                    Result<UserProfile>.Failure("User not found", StatusCodes.Status404NotFound) : 
                    Result<UserProfile>.Success(profile);
            }
        }   
    }
}