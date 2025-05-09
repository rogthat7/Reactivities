using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public required DbSet<Activity> Activities { get; set; }
        public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public required DbSet<Photo> Photos { get; set; }
        public required DbSet<Comment> Comments { get; set; }
        public required DbSet<UserFollowing> UserFollowings { get; set; } //Follwers and Followings
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ActivityAttendee>(x=>x.HasKey(a=> new {a.ActivityId,a.UserId}));
            builder.Entity<ActivityAttendee>()
            .HasOne(x=>x.User)
            .WithMany(x=>x.Activities)
            .HasForeignKey(x=>x.UserId);

            builder.Entity<ActivityAttendee>()
            .HasOne(x=>x.Activity)
            .WithMany(x=>x.Attendees)
            .HasForeignKey(x=>x.ActivityId);

            builder.Entity<UserFollowing>(x=>
                {
                    x.HasKey(uf=> new {uf.ObserverId,uf.TargetId});
                    
                    x.HasOne(uf=>uf.Observer)
                        .WithMany(u=>u.Followings)
                        .HasForeignKey(uf=>uf.ObserverId)
                        .OnDelete(DeleteBehavior.Cascade);
                    x.HasOne(uf=>uf.Target)
                        .WithMany(u=>u.Followers)
                        .HasForeignKey(uf=>uf.TargetId)
                        .OnDelete(DeleteBehavior.Cascade);
                }
            );


            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v =>v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );

            foreach (var entityType in builder.Model.GetEntityTypes())
            {
               foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(dateTimeConverter);
                    }
                }
            }
        }
    }
}