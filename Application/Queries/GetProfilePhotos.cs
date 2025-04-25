using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Queries
{
    public class GetProfilePhotos
    {
        public class Query : IRequest<Result<List<Photo>>>
        {
            public required string UserId { get; set; } = string.Empty;
        }
        public class Handler : IRequestHandler<Query, Result<List<Photo>>>
        {
            private readonly DataContext _dataContext;

            public Handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }

            public async Task<Result<List<Photo>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var photos = await _dataContext.Photos
                    .Where(x => x.UserId == request.UserId)
                    .ToListAsync(cancellationToken: cancellationToken);

                if (photos == null || photos.Count == 0) return Result<List<Photo>>.Failure("No photos found", StatusCodes.Status404NotFound);

                return Result<List<Photo>>.Success(photos);
            }
        }
    }
}