

using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Resend;

namespace Infrastructure.Email;

public class EmailSender : IEmailSender<User>
{
    private readonly IResend _resend;

    public EmailSender(IResend resend)
    {
        _resend = resend ?? throw new ArgumentNullException(nameof(resend));
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
        }
        catch (Exception ex)
        {
            // Handle exceptions (e.g., log the error)
            throw new InvalidOperationException("Failed to send email", ex);
        }

    }


    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

}
