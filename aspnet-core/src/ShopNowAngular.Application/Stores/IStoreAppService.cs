using Abp.Application.Services;
using ShopNowAngular.Stores.Dtos;
using System;

namespace ShopNowAngular.Stores
{
    public interface IStoreAppService : IAsyncCrudAppService<GetStoreDto, Guid, PagedStoreResultRequestDto, CreateStoreDto, UpdateStoreDto>
    {
    }
}
