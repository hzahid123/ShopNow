using ShopNowAngular.Emails.Dtos;
using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ShopNowAngular.Emails
{
    public interface IEmailAppService
    {
        Task<(bool, string)> SendEmailGeneric(MailMessage mailMessage);
        string CreateAuthenticationEmailHtmlContent(string otp);
        Task<MailMessage> CreateEmailContent(List<string> recipientEmails, string subject, string body);
        Task<(bool, string)> SendEmailForStoreOwnerCreation(CreateEmailDto input);

    }
}
