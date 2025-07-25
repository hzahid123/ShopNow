using System.Collections.Generic;
using System.Net.Mail;
using System.Net;
using System.Threading.Tasks;
using Abp.Net.Mail;
using ShopNowAngular.Configuration.EmailConfigurations;
using ShopNowAngular.Emails.Dtos;

namespace ShopNowAngular.Emails
{
    public class EmailAppService : ShopNowAngularAppServiceBase, IEmailAppService
    {
        private readonly IEmailSender _emailSender;

        public EmailAppService(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task<(bool, string)> SendEmailForStoreOwnerCreation(CreateEmailDto input)
        {
            string subject = "Store Creation";
            string body = GenerateEmailBody(input);
            var mailMessage = CreateMailMessage(input.EmailAddress, subject, body);
            return await SendEmailGeneric(mailMessage);
        }




        public string CreateAuthenticationEmailHtmlContent(string otp)
        {
            return "<html>\r\n\r\n<head>\r\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=us-ascii\">\">\r\n    <style>\r\n        body {\r\n            background-color: #f5f5f5;\r\n            font-family: 'Arial', sans-serif;\r\n        }\r\n\r\n        .card {\r\n            background-color: #ffffff;\r\n            border-radius: 10px;\r\n            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\r\n            padding: 20px;\r\n            max-width: 400px;\r\n            margin: 0 auto;\r\n            text-align: left;\r\n        }\r\n\r\n        img {\r\n            display: block;\r\n            margin: 0 auto;\r\n            width: 150px;\r\n            margin-bottom: 15px;\r\n        }\r\n\r\n        h2 {\r\n            color: #8700FF;\r\n            text-align: center;\r\n        }\r\n    </style>\r\n</head>\r\n\r\n<body>\r\n    <div class=\"card\">\r\n        <img src=\"https://img/SCMSlogo.png\" alt=\"SCMS Logo\">\r\n        <h2>Welcome to SCMS Portal</h2>\r\n        <p>\r\n            Hi,<br><br>\r\n            We received your request for a single-use code to use with your SCMS account.<br><br>\r\n            Your single-use code is: <center><h3>" + otp + "</h3></center>\r\n            If you didn't request this code, you can safely ignore this email; the code will expire in 60 seconds.<br><br>\r\n           <br>\r\n            \r\n        </p>\r\n    </div>\r\n</body>\r\n\r\n</html>";


        }
        public async Task<(bool, string)> SendEmailGeneric(MailMessage mailMessage)
        {
            string errorMessage = string.Empty;
            try
            {
                string smtpServer = EmailSettings.SmtpHost.ToString();
                string userName = EmailSettings.SmtpUserName.ToString();
                string password = EmailSettings.SmtpPassword.ToString();
                var smtpClient = new SmtpClient(smtpServer)
                {
                    Port = EmailSettings.SmtpPort,
                    Credentials = new NetworkCredential(userName, password),
                    EnableSsl = bool.Parse(EmailSettings.SmtpEnableSsl.ToString())
                };

                smtpClient.Send(mailMessage);
                return (true, errorMessage);
            }
            catch (System.Exception ex)
            {
                errorMessage = "Unable to send mail contact your admin";
                return (false, errorMessage);
            }
        }
        public async Task<MailMessage> CreateEmailContent(List<string> recipientEmails, string subject, string body)
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(EmailSettings.SmtpUserName.ToString()),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            foreach (var recipientEmail in recipientEmails)
            {
                mailMessage.To.Add(recipientEmail);
            }

            return mailMessage;
        }
        private MailMessage CreateMailMessage(string emailAddress, string subject, string body)
        {
            var mailMessage = new MailMessage
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
                From = new MailAddress(EmailSettings.SmtpUserName.ToString()),
            };

            mailMessage.To.Add(emailAddress);

            return mailMessage;
        }
        private string GenerateEmailBody(CreateEmailDto input)
        {
            return $@"
                    <html>
                    <head>
                        <meta http-equiv=""Content-Type"" content=""text/html; charset=us-ascii"">
                        <style>
                            body {{
                                background-color: #f5f5f5;
                                font-family: 'Arial', sans-serif;
                            }}
                            .card {{
                                background-color: #ffffff;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                padding: 20px;
                                max-width: 400px;
                                margin: 0 auto;
                                text-align: left;
                            }}
                            img {{
                                display: block;
                                margin: 0 auto;
                                width: 150px;
                                margin-bottom: 15px;
                            }}
                            h2 {{
                                color: #8700FF;
                                text-align: center;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class=""card"">
                           
                            <h2>Welcome to DryRun Services</h2>
                            <p>
                                Hi,<br>{input.UserName}<br>
                                Here are your login credentials:<br><br>
                                Username: {input.EmailAddress}<br>
                                Temporary Password: {input.Password}<br><br>
                                &#8226; Please refrain from sharing these credentials with anyone for security reasons.<br>
                                &#8226; For your safety, we recommend resetting your password immediately upon logging in.<br><br>
                            </p>

                        </div>
                    </body>
                    </html>";

        }
    }
}
