using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ShopNowAngular.Configuration;

namespace ShopNowAngular.Web.Host.Startup
{
    [DependsOn(
       typeof(ShopNowAngularWebCoreModule))]
    public class ShopNowAngularWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public ShopNowAngularWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ShopNowAngularWebHostModule).GetAssembly());
        }
    }
}
