using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Models.TokenAuth
{
    public class VerifyOtpModel
    {
        public string OTP { get; set; }
        public string UsernameAndEmail { get; set; }
        public Guid? StoreId { get; set; }
    }
}
