using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ShopNowAngular.Authorization;

namespace ShopNowAngular
{
    [DependsOn(
        typeof(ShopNowAngularCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class ShopNowAngularApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<ShopNowAngularAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(ShopNowAngularApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
