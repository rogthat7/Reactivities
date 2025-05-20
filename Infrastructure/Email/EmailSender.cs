

using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Resend;

namespace Infrastructure.Email;

public class EmailSender : IEmailSender<User>
{
    private readonly IResend _resend;
    private readonly IConfiguration _config;

    public EmailSender(IResend resend, IConfiguration config)
    {
        _resend = resend ?? throw new ArgumentNullException(nameof(resend));
        _config = config;
    }
    public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        var subject = "Please confirm your email address";
        var body = $@"
            <html>
                <body>
                    <p>Hi {user.DisplayName},</p>
                    <p>Please confirm your email address by clicking <a href='{confirmationLink}'>here</a>.</p>
                </body>
            </html>
        ";
        await SendMailAsync(email, subject, body);
    }

    private async Task SendMailAsync(string email, string subject, string body)
    {
        try
        {
            // Assuming _resend is the instance of IResend passed in the constructor
            var message = new EmailMessage
            {
                From = "reactivities@resend.dev",
                Subject = subject,
                HtmlBody = body
            };
            message.To.Add(email);
            Console.WriteLine(message.HtmlBody);
            await _resend.EmailSendAsync(message);
            // await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            // Handle exceptions (e.g., log the error)
            throw new InvalidOperationException("Failed to send email", ex);
        }

    }


    public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        var subject = "Reset your password";
        var body = $@"
            <html>
                <body>
                    <p>Hi {user.DisplayName},</p>
                    <p>
                        Please click <a href='{_config["ClientAppUrl"]}/reset-password?email={email}&resetCode={resetCode}'>here</a> 
                        to reset your password.
                    </p>
                    <p>
                        If you did not request a password reset, please ignore this email.
                    </p>
                </body>
            </html>
        ";
        await SendMailAsync(email, subject, body);
    }

    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

}
