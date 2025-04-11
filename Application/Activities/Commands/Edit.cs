using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;
using static Application.Activities.Edit;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result  <Unit>>
        {
            public EditActivityDto ActivityDto { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityDto.Id);
                if (activity == null)
                {
                    return Result<Unit>.Failure("Activity not found", 404);
                }
                _mapper.Map(request.ActivityDto, activity);
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update activity", 422);
                }
                return Result<Unit>.Success(Unit.Value);
            }
        }
       
    }
}