using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<Activity>>
        {
            public Guid Id { get; set;}
        }
        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var result = await _context.Activities.FindAsync([request.Id], cancellationToken: cancellationToken) ;
                if (result == null)
                {
                    return Result<Activity>.Failure("Activity not found", 404);
                }
                return Result<Activity>.Success(result);
            }
        }
    }
}