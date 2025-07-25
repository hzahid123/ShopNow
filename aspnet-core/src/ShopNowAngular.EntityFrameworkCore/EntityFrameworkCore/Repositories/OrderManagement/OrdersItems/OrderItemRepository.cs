using Abp.Application.Services.Dto;
using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.orders;
using ShopNowAngular.Repositories.OrderManagement.OrdersItems.Dtos;
using ShopNowAngular.Repositories.StoreManagement.StoreRequests.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.OrderManagement.OrdersItems
{
    public class OrderItemRepository : ShopNowAngularRepositoryBase<Order, Guid>
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public OrderItemRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }

        public async Task<PagedResultDto<GetOrderItemsRequestSpDto>> GetAllOrdersItems(PagedOrderItemsRequestResultRequestSpDto input)
           => await ExecuteSearchStoreProcedure<PagedOrderItemsRequestResultRequestSpDto, GetOrderItemsRequestSpDto>(input, "[Order].[GetAllOrderItems]");


    }
}


