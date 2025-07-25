using System.Threading.Tasks;
using Abp.Application.Services;
using ShopNowAngular.Authorization.Accounts.Dto;

namespace ShopNowAngular.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
