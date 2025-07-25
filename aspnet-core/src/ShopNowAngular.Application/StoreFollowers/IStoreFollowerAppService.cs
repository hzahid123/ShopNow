using Abp.Application.Services;
using ShopNowAngular.StoreFollowers.Dtos;
using ShopNowAngular.Stores.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.StoreFollowers
{
    public interface IStoreFollowerAppService : IAsyncCrudAppService<GetStoreFollowerDto, Guid, PagedStoreFollowerResultRequestDto, CreateStoreFollowerDto, UpdateStoreFollowerDto>
    {
    }
}
