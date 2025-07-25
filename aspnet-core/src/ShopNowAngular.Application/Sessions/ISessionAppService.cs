using System.Threading.Tasks;
using Abp.Application.Services;
using ShopNowAngular.Sessions.Dto;

namespace ShopNowAngular.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
