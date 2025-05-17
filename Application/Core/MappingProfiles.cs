using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities.DTOs;
using Application.Profiles.DTOs;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string? currentUserId = null;
            CreateMap<Activity, Activity>();
            CreateMap<User, IdentityUser>();
            CreateMap<CreateActivityDto, Activity>();
            CreateMap<EditActivityDto, Activity>();
            CreateMap<Activity, ActivityDto>()
            .ForMember(d => d.HostDisplayName, o => o.MapFrom(s =>
                s.Attendees.FirstOrDefault(x => x.IsHost)!.User.DisplayName))
            .ForMember(d => d.HostId, o => o.MapFrom(s =>
                s.Attendees.FirstOrDefault(x => x.IsHost)!.User.Id));
                
            CreateMap<ActivityAttendee, UserProfile>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s =>
                s.User.DisplayName))
            .ForMember(d => d.Bio, o => o.MapFrom(s =>
                s.User.Bio))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s =>
                s.User.ImageUrl))
            .ForMember(d => d.Id, o => o.MapFrom(s =>
                s.User.Id))
            .ForMember(d => d.IsFollowing, o => o.MapFrom(s =>
            s.User.Followers.Any(x => x.Observer.Id == currentUserId)))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s =>
                s.User.Followers.Count))
            .ForMember(d => d.FollowingsCount, o => o.MapFrom(s =>
                s.User.Followings.Count));

            CreateMap<User, UserProfile>()
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s =>
                s.Followers.Count))
            .ForMember(d => d.FollowingsCount, o => o.MapFrom(s =>
                s.Followings.Count))
            .ForMember(d => d.IsFollowing, o => o.MapFrom(s =>
                s.Followers.Any(x => x.Observer.Id == currentUserId)));

            CreateMap<EditProfileDto, UserProfile>();
            CreateMap<Comment, CommentDto>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s =>
                s.User.DisplayName))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s =>
                s.User.ImageUrl))
            .ForMember(d => d.UserId, o => o.MapFrom(s =>
                s.User.Id));
            CreateMap<Activity, UserActivityDto >();
        }
    }
}