using Abp.Application.Services.Dto;
using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.Repositories.OrderManagement.Orders.Dtos;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.StoreManagement.Stores;
using ShopNowAngular.Repositories.StoreManagement.Stores.Dtos;
using ShopNowAngular.Stores;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.StoreManagement.Stores
{
    public class StoreRepository :ShopNowAngularRepositoryBase <Store, Guid>, IStoreRepository
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public StoreRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }

        public async Task<PagedResultDto<GetStoreSpDto>> GetAllStoresSP(PagedStoreResultRequestSpDto input)
           => await ExecuteSearchStoreProcedure<PagedStoreResultRequestSpDto, GetStoreSpDto>(input, "[Store].[GetAllStores]");

        public async Task<List<GetTotalStoresSpDto>> GetTotalStoresSp(PagedTotalStoresResultRequestSpDto input)
       => await ExecuteSearchStoreProcedureWithOutPagination<PagedTotalStoresResultRequestSpDto, GetTotalStoresSpDto>(input, "[dbo].[GetTotalStores]");




        

        public async Task<List<GetTopStoresBySalesSpDto>> GetTopStoresBySalesSp(PagedTopStoresBySalesResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedTopStoresBySalesResultRequestSpDto, GetTopStoresBySalesSpDto>(input, "[dbo].[GetTopStoresBySales]");

       


        public async Task<List<GetRecentStoresSpDto>> GetRecentStoresSp(PagedRecentStoresResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedRecentStoresResultRequestSpDto, GetRecentStoresSpDto>(input, "[dbo].[GetRecentStores]");

        public async Task<List<GetTopFollowedStoresSpDto>> GetTopFollowedStoresSp(PagedTopFollowedStoresResultRequestSpDto input)
         => await ExecuteSearchStoreProcedureWithOutPagination<PagedTopFollowedStoresResultRequestSpDto, GetTopFollowedStoresSpDto>( input, "[dbo].[GetTopFollowedStores]");

        public async Task<List<GetTotalStoreFollowersSpDto>> GetTotalStoreFollowersSp(PagedTotalStoreFollowersResultRequestSpDto input)
           => await ExecuteSearchStoreProcedureWithOutPagination<PagedTotalStoreFollowersResultRequestSpDto, GetTotalStoreFollowersSpDto>( input, "[dbo].[GetTotalStoreFollowers]");

    }
}
