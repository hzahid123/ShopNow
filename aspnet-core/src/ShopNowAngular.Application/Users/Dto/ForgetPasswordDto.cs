using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Users.Dto
{
    public class ForgetPasswordDto
    {
        public string NewPassword { get; set; }
        public string EmailAddress { get; set; }
    }
}
