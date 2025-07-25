using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Configuration.EmailConfigurations
{
    public static class EmailSettings
    {
        public static string SmtpHost { get; set; }
        public static int SmtpPort { get; set; }
        public static string SmtpUserName { get; set; }
        public static string SmtpPassword { get; set; }
        public static string SmtpDomain { get; set; }
        public static bool SmtpEnableSsl { get; set; }
        public static bool SmtpUseDefaultCredentials { get; set; }
    }
}
