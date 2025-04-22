using System.ComponentModel.DataAnnotations;

namespace Domain;

public class Activity
{
    [Required]
    public Guid Id { get; set; } 
    [Required]
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public required string Description { get; set; }
    public required string Category { get; set; }
    public bool IsCancelled { get; set; }
    /// <summary>
    /// location of the activity
    /// </summary>
    public required string City { get; set; }
    public required string Venue { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    // navigation properties
    public ICollection<ActivityAttendee> Attendees { get; set; } = [];
}
