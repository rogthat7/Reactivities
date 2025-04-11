
using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware(ILogger<ExceptionMiddleware> logger, IHostEnvironment env) : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (ValidationException ex)
            {
                await HandleValidationExceptionAsync(context, ex);
            }
            catch (Exception ex)
            {
                await HandleGeneralExceptionAsync(context, ex);
            }

        }

        private async Task HandleGeneralExceptionAsync(HttpContext context, Exception ex)
        {
            logger.LogError(ex, ex.Message);
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            var response = env.IsDevelopment()
                ? new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "An error occurred while processing your request.",
                    Detail = ex.StackTrace,
                    Instance = context.Request.Path
                }
                : new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "An error occurred while processing your request.",
                    Instance = context.Request.Path
                }; 
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                };
                var json = JsonSerializer.Serialize(response, options);
                await context.Response.WriteAsync(json);
        }

        private static async Task HandleValidationExceptionAsync(HttpContext context, ValidationException ex)
        {
            var validationErrors = new Dictionary<string, string[]>();
            if(ex.Errors is not null)
            {
                foreach (var error in ex.Errors)
                {   
                    if (validationErrors.TryGetValue(error.PropertyName, out var existingErrors))
                    {
                        validationErrors[error.PropertyName] = existingErrors.Append(error.ErrorMessage).ToArray();
                    }
                    else
                    {
                        validationErrors[error.PropertyName] = new[] { error.ErrorMessage };
                    }
                }
                context.Response.StatusCode = StatusCodes.Status422UnprocessableEntity;
                var validationProblemDetails = new ValidationProblemDetails(validationErrors)
                {
                    Status = StatusCodes.Status422UnprocessableEntity,
                    Title = "Validation Error",
                    Detail = "One or more validation errors occurred.",
                    Instance = context.Request.Path
                };
                await context.Response.WriteAsJsonAsync(validationProblemDetails);
            }
        }
    }
}
