namespace Application.Profiles.DTOs;

public class UserProfile
{
    public required string Id { get; set; }
    public required string DisplayName { get; set; }
    public string? Bio { get; set; }
    public required string ImageUrl { get; set; }
    public bool IsFollowing { get; set; }
    public int FollowersCount { get; set; }
    public int FollowingsCount { get; set; }
}
