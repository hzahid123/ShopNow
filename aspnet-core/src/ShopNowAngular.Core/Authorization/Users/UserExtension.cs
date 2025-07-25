using Abp.Authorization.Users;
using ShopNowAngular.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.Authorization.Users
{
    public class UserExtension : AbpUser<User>
    {
        public UserType UserType { get; set; }
        public string EmailCodeVerification { get; set; }
        public DateTime? EmailCodeSendingTime { get; set; }
        public bool TwoFactorAuthCheck {  get; set; }

        [NotMapped]
        public Guid? StoreId { get; set; }
    }
}
