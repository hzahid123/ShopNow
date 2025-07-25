using Abp.Application.Services;
using ShopNowAngular.MultiTenancy.Dto;

namespace ShopNowAngular.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

