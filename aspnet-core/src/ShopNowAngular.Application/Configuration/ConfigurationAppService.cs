using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using ShopNowAngular.Configuration.Dto;

namespace ShopNowAngular.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : ShopNowAngularAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
