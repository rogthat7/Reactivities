using API.Middleware;
using Application.Activities;
using Application.Activities.Validators;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using Infrastructure.Email;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;
using Resend;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
        {

            services.AddEndpointsApiExplorer();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });
            services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("cookieAuth", new OpenApiSecurityScheme
                {
                    Name = "Cookie",
                    Type = SecuritySchemeType.ApiKey,
                    In = ParameterLocation.Cookie,
                    Description = "Cookie-based authentication"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "cookieAuth"
                            }
                        },
                        new string[] {}
                    }
                });
            });
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader()
                    .AllowCredentials()
                    .AllowAnyMethod().WithOrigins("http://localhost:3000", "https://localhost:3000");
                });
            });
            services.AddSignalR();
            services.AddMediatR(cfg =>
                {
                    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
                    cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly);
                }
            );
            
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            
            services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();
            services.AddTransient<ExceptionMiddleware>();
            services.AddIdentityApiEndpoints<User>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<DataContext>();
            services.Configure<IdentityOptions>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
            });

            // Configure Resend
            services.AddOptions();
            services.AddHttpClient<ResendClient>();
            services.Configure<ResendClientOptions>(opt => {
                opt.ApiToken = config["Resend:ApiToken"];
                });
            services.AddTransient<IResend, ResendClient>();
            services.AddTransient<IEmailSender<User>, EmailSender>();
            


            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            return services;
        }
    }
}