using System.Text.Json.Serialization;

namespace API.DTOs;

public class GitHubInfo
{
    public class GitHubAuthRequest
    {
        public required string Code { get; set; }
        [JsonPropertyName("client_id")]
        public required string ClientId { get; set; }
        [JsonPropertyName("client_secret")]
        public required string ClientSecret { get; set; }
        [JsonPropertyName("redirect_uri")]
        public required string RedirectUri { get; set; }
    }

    public class GitHubResponseAccessToken
    {
        [JsonPropertyName("access_token")]
        public required string AccessToken { get; set; }
    }

    public class GitHubUserResponse
    {
        public string Email { get; set; }
        public string Login { get; set; }
        public string Name { get; set; }
        [JsonPropertyName("avatar_url")]
        public string ImageUrl { get; set; }
    }

    public class GitHubEmailResponse
    {
        public string Email { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsVerified { get; set; }
    }
}
