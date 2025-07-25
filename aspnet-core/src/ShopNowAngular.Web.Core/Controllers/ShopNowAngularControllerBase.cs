using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace ShopNowAngular.Controllers
{
    public abstract class ShopNowAngularControllerBase: AbpController
    {
        protected ShopNowAngularControllerBase()
        {
            LocalizationSourceName = ShopNowAngularConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
