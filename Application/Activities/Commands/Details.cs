using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<ActivityDto>>
        {
            public Guid Id { get; set;}
        }
        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                .Include(a => a.Attendees)
                .ThenInclude(u => u.User)
                .FirstOrDefaultAsync(x=>x.Id == request.Id, cancellationToken: cancellationToken) ;

                if (activity == null)
                {
                    return Result<ActivityDto>.Failure("Activity not found", 404);
                }
                return Result<ActivityDto>.Success(_mapper.Map<ActivityDto>(activity));
            }
        }
    }
}