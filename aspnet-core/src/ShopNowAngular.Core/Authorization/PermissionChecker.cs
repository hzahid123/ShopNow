using Abp.Authorization;
using ShopNowAngular.Authorization.Roles;
using ShopNowAngular.Authorization.Users;

namespace ShopNowAngular.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
