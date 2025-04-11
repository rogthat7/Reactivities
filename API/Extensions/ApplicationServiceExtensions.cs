using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Middleware;
using Application.Activities;
using Application.Activities.Validators;
using Application.Core;
using FluentValidation;
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
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(cfg=>
                {
                    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
                    cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly);
                }
            );
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();
            services.AddTransient<ExceptionMiddleware>();
            return services;
        }
    }
}