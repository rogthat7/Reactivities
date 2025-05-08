namespace Domain;

public class Comment
{
    public string  Id { get; set; } = Guid.NewGuid().ToString();
    public required string  Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public required string UserId { get; set; }
    public User User { get; set; } = null!;
    public required Guid ActivityId { get; set; }
    public Activity Activity { get; set; } = null!;
}
