using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Configuration.StoresConfiguration
{
    public static class StoreIdConfiguration
    {
        private static IHttpContextAccessor _httpContextAccessor;
        public static void Initialize(IServiceProvider serviceProvider)
        {
            _httpContextAccessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();
        }
        public static string GetCurrentUserStoreId()
        {
            var claims = _httpContextAccessor.HttpContext.User.Claims.Where(c => c.Type.Equals("BusinessConfigurationId"))
                                                                     .FirstOrDefault();
            if (claims != null)
            {
                return claims.Value;
            }
            return null;
        }
    }
}
