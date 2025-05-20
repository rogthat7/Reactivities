using System.Net.Http.Headers;
using System.Text;
using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using static API.DTOs.GitHubInfo;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController(SignInManager<User> signInManager
    , IEmailSender<User> emailSender
    , IConfiguration config) : BaseApiController
    {
        [AllowAnonymous]
        [HttpPost("github-login")]
        public async Task<ActionResult> LoginWithGithub(string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                return BadRequest("Missing authorization code");
            }
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));
            // step 1 - get access token
            var accessToken = await httpClient.PostAsJsonAsync("https://github.com/login/oauth/access_token",
                new GitHubAuthRequest
                {
                    ClientId = config["Authentication:Github:ClientId"]!,
                    ClientSecret = config["Authentication:Github:ClientSecret"]!,
                    Code = code,
                    RedirectUri = $"{config["ClientAppUrl"]}/auth-callback"
                }
            );
            if (!accessToken.IsSuccessStatusCode)
            {
                return BadRequest("Failed to get access token");
            }
            var accessTokenContent = await accessToken.Content.ReadFromJsonAsync<GitHubResponseAccessToken>();
            if (accessTokenContent == null)
            {
                return BadRequest("Failed to get access token");
            }
            // step 2 - get user info
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", accessTokenContent.AccessToken);
            httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Reactivities");
            var userInfo = await httpClient.GetAsync(
                "https://api.github.com/user"
            );
            if (!userInfo.IsSuccessStatusCode)
            {
                return BadRequest("Failed to get user info from GitHub");
            }
            var userInfoContent = await userInfo.Content.ReadFromJsonAsync<GitHubUserResponse>();
            // step 3 - getting email if public
            if (string.IsNullOrEmpty(userInfoContent.Email))
            {
                var emailInfo = await httpClient.GetAsync(
                    "https://api.github.com/user/emails"
                );
                if (!emailInfo.IsSuccessStatusCode)
                {
                    return BadRequest("Failed to get user email info");
                }
                var emailInfoContent = await emailInfo.Content.ReadFromJsonAsync<List<GitHubEmailResponse>>();
                if (emailInfoContent == null)
                {
                    return BadRequest("Failed to get user emails");
                }
                var primary = emailInfoContent?.FirstOrDefault(e => e is { IsVerified: true, IsPrimary: true })?.Email ?? string.Empty;
                if (string.IsNullOrEmpty(primary))
                {
                    return BadRequest("Failed to get user email from GitHub");
                }
                userInfoContent.Email = primary;
            }
            // step 4 - create user
            var existingUser = await signInManager.UserManager.FindByEmailAsync(userInfoContent.Email);
            if (existingUser == null)
            {
                existingUser = new User
                {
                    UserName = userInfoContent.Login,
                    Email = userInfoContent.Email,
                    DisplayName = userInfoContent.Name,
                    ImageUrl = userInfoContent.ImageUrl
                };
                var result = await signInManager.UserManager.CreateAsync(existingUser);
                if (!result.Succeeded) return BadRequest("Failed to create user");

            }          
            await signInManager.SignInAsync(existingUser, false);
            return Ok();
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName
            };

            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await SendConfirmationEmailAsync(user, registerDto.Email);
                return Ok(new { Username = user.UserName, Email = user.Email });
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }
        }
        [AllowAnonymous]
        [HttpGet("resendConfirmEmail")]
        public async Task<ActionResult> ResendConfirmEmail(string email, string userId)
        {
            if (string.IsNullOrEmpty(email) && string.IsNullOrEmpty(userId))
            {
                return BadRequest("Email or userId is null or empty");
            }
            var user = await signInManager.UserManager.Users
                                .FirstOrDefaultAsync(x => x.Id == userId || x.Email == email);
            if (user == null || string.IsNullOrEmpty(user.Email))
            {
                return NotFound("User not found");
            }
            await SendConfirmationEmailAsync(user, user.Email);
            return Ok();
        }

        private async Task SendConfirmationEmailAsync(User user, string email)
        {
            var code = await signInManager.UserManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));//Encoding.UTF8.GetBytes(code)

            var confirmEmailUrl = $"{config["ClientAppUrl"]}/confirm-email?userId={user.Id}&code={code}";
            await emailSender.SendConfirmationLinkAsync(user, email, confirmEmailUrl);
        }

        [AllowAnonymous]
        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false)
            {
                return NoContent();
            }
            var user = await signInManager.UserManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { Message = "User not found" });
            }
            return Ok(new
            {
                user.UserName
            ,
                user.Email
            ,
                user.DisplayName
            ,
                user.ImageUrl
            ,
                user.Id
            });
        }
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();
            return Ok(new { Message = "User logged out successfully" });
        }

        [HttpPut("change-password")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var user = await signInManager.UserManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { Message = "User not found" });
            }
            var result = await signInManager.UserManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword,changePasswordDto.NewPassword );
            if (result.Succeeded)
            {
                return Ok(new { Message = "Password changed successfully" });
            }
            else
            {
                return BadRequest(result.Errors.First().Description);
            }
        }
    }

}