using Application.Profiles.DTOs;

namespace Application.Activities.DTOs;

public class ActivityDto
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public DateTime Date { get; set; }
    public required string Description { get; set; }
    public required string Category { get; set; }
    public bool IsCancelled { get; set; }
    public required string HostDisplayName { get; set; }
    public required string HostId { get; set; }
    /// <summary>
    /// location of the activity
    /// </summary>
    public required string City { get; set; }
    public required string Venue { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    // navigation properties
    public ICollection<UserProfile> Attendees { get; set; } = [];
}
