using Microsoft.Extensions.Configuration;
using ShopNowAngular.Configuration.EmailConfigurations;

namespace ShopNowAngular.Web.Host.Startup
{
    public class EmailConfigurationResolver
    {
        public static void Configure(IConfiguration configuration)
        {
            EmailSettings.SmtpHost = configuration["Email:Smtp:Host"];
            EmailSettings.SmtpPort = int.Parse(configuration["Email:Smtp:Port"]);
            EmailSettings.SmtpUserName = configuration["Email:Smtp:UserName"];
            EmailSettings.SmtpPassword = configuration["Email:Smtp:Password"];
            EmailSettings.SmtpDomain = configuration["Email:Smtp:Domain"];
            EmailSettings.SmtpEnableSsl = bool.Parse(configuration["Email:Smtp:EnableSsl"].ToString());
            EmailSettings.SmtpUseDefaultCredentials = bool.Parse(configuration["Email:Smtp:UseDefaultCredentials"].ToString());
        }
    }
}
