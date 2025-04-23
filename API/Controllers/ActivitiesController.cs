using Application.Activities;
using Application.Activities.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            var res =  await Mediator.Send(new List.Query());
            return Ok(res);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> GetActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<ActionResult<string>> CreateActivity(CreateActivityDto activityDto)
        {
           return HandleResult(await Mediator.Send(new CreateActivity.Command{ActivityDto = activityDto})); 
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, EditActivityDto activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{ActivityDto = activity}));
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
           return HandleResult (await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}