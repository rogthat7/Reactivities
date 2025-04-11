using Domain;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.Validators
{
    public class EditActivityValidator : BaseActivityValidator<Edit.Command, EditActivityDto>
    {
        public EditActivityValidator() : base(x => x.ActivityDto)
        {
            // RuleFor(x => x.ActivityDto.Id).NotNull().WithMessage("Activity ID is required."); It is part of URL
        }
       
    }
}
