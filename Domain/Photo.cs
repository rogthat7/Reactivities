using System.Text.Json.Serialization;

namespace Domain;

public class Photo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Url { get; set; } = string.Empty;
    public required string  PublicId { get; set; }
    public required string UserId { get; set; }
    [JsonIgnore]
    public User User { get; set; } = null!;
}
