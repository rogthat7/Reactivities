using API.Middleware;
using Application.Activities;
using Application.Activities.Validators;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, 
        IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddDbContext<DataContext>(opt=>{
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });
            services.AddSwaggerGen();
            services.AddCors(opt=>{
                opt.AddPolicy("CorsPolicy", policy=>{
                    policy.AllowAnyHeader()
                    .AllowCredentials()
                    .AllowAnyMethod().WithOrigins("http://localhost:3000", "https://localhost:3000");
                });
            });
            services.AddMediatR(cfg=>
                {
                    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
                    cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly);
                }
            );
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();
            services.AddTransient<ExceptionMiddleware>();
            services.AddIdentityApiEndpoints<User>(opt => {
                opt.User.RequireUniqueEmail = true; 
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<DataContext>();
            services.AddAuthorization(opt => {
                opt.AddPolicy("IsActivityHost", policy => {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            return services;
        }
    }
}