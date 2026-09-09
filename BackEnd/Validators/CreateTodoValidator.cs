using BackEnd.DTOs;
using FluentValidation;

namespace BackEnd.Validators
{
    public class CreateTodoValidator : AbstractValidator<CreateTodoDto>
    {
        public CreateTodoValidator() {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Title must be at least 3 characters")
                .MaximumLength(20)
                .WithMessage("Title cannot exceed 100 characters");
            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("Description is required");
            RuleFor(x => x.Priority)
                .NotEmpty()
                .WithMessage("Priority is required");
            RuleFor(x => x.Category)
                .NotEmpty()
                .WithMessage("Category is required");
            RuleFor(x => x.DueDate).GreaterThanOrEqualTo(DateTime.Today).WithMessage("Due Date is not pas Date");
        }
    }
}
