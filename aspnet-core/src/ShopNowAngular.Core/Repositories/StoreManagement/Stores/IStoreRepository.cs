using Abp.Application.Services.Dto;
using ShopNowAngular.Repositories.StoreManagement.Stores.Dtos;
using ShopNowAngular.Repositories.Users.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.StoreManagement.Stores
{
    public interface IStoreRepository
    {
        Task<PagedResultDto<GetStoreSpDto>> GetAllStoresSP(PagedStoreResultRequestSpDto input);

        Task<List<GetTotalStoresSpDto>> GetTotalStoresSp(PagedTotalStoresResultRequestSpDto input);

        Task<List<GetTopStoresBySalesSpDto>> GetTopStoresBySalesSp(PagedTopStoresBySalesResultRequestSpDto input);

        Task<List<GetRecentStoresSpDto>> GetRecentStoresSp(PagedRecentStoresResultRequestSpDto input);

        Task<List<GetTopFollowedStoresSpDto>> GetTopFollowedStoresSp(PagedTopFollowedStoresResultRequestSpDto input);

        Task<List<GetTotalStoreFollowersSpDto>> GetTotalStoreFollowersSp(PagedTotalStoreFollowersResultRequestSpDto input);



    }
}
