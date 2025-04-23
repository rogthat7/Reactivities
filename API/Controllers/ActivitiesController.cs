using Application.Activities;
using Application.Activities.Commands;
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
        public async Task<ActionResult<List<ActivityDto>>> GetActivities()
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

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, EditActivityDto activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{ActivityDto = activity}));
        }
        
        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
           return HandleResult (await Mediator.Send(new Delete.Command{Id = id}));
        }
        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendence.Command{Id = id}));
        }
        // [HttpPost("{id}/cancel")]
        // public async Task<IActionResult> Cancel(Guid id)
        // {
        //     return HandleResult(await Mediator.Send(new UpdateAttendence.Command{Id = id, IsGoing = false}));
        // }
    }
}