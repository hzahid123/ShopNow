using System.Threading.Tasks;
using ShopNowAngular.Configuration.Dto;

namespace ShopNowAngular.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
