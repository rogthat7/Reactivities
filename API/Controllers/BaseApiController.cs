using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ?? HttpContext.RequestServices.GetService<IMediator>() ?? throw new InvalidOperationException("Mediator not found in the service collection.");
        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result.IsSuccess && result.Data != null)
            {
                return Ok(result);
            }

            if (result.StatusCode == 404)
            {
                return NotFound(result);
            }

            if (result.StatusCode == 422)
            {
                return UnprocessableEntity(result);
            }
            return BadRequest(result);
        }
    }
}