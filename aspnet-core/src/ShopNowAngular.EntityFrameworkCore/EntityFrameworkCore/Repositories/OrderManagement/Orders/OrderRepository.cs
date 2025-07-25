using Abp.Application.Services.Dto;
using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.orders;
using ShopNowAngular.Repositories.OrderManagement.Orders;
using ShopNowAngular.Repositories.OrderManagement.Orders.Dtos;
using ShopNowAngular.Repositories.ProductManagement.Products;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.StoreManagement.StoreRequests.Dtos;
using ShopNowAngular.Repositories.StoreManagement.Stores.Dtos;
using ShopNowAngular.Stores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.OrderManagement.Orders
{
    public class OrderRepository : ShopNowAngularRepositoryBase<Order, Guid>, IOrderRepository
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public OrderRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }

        public async Task<PagedResultDto<GetOrderRequestSpDto>> GetAllOrders(PagedOrderRequestResultRequestSpDto input)
           => await ExecuteSearchStoreProcedure<PagedOrderRequestResultRequestSpDto, GetOrderRequestSpDto>(input, "[Order].[GetAllOrders]");

       

      

        public async Task<List<GetTotalSalesByStoreSpDto>> GetTotalSalesByStoreSp(GetTotalSalesByStorePagedRequestSpDto input)
    => await ExecuteSearchStoreProcedureWithOutPagination<GetTotalSalesByStorePagedRequestSpDto, GetTotalSalesByStoreSpDto>(input, "[dbo].[GetTotalSalesByStore]");

        


        // 3. Total Orders
        public async Task<List<GetTotalOrdersByStoreSpDto>> GetTotalOrdersByStoreSp(PagedTotalOrdersByStoreResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedTotalOrdersByStoreResultRequestSpDto, GetTotalOrdersByStoreSpDto>(input, "[dbo].[GetTotalOrdersByStore]");

        


        // 4. Total Customers
        public async Task<List<GetTotalCustomersByStoreSpDto>> GetTotalCustomersByStoreSp(GetTotalCustomersByStorePagedRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<GetTotalCustomersByStorePagedRequestSpDto, GetTotalCustomersByStoreSpDto>(input, "[dbo].[GetTotalCustomersByStore]");

     


        // 5. Monthly Sales
        public async Task<List<GetMonthlySalesByStoreSpDto>> GetMonthlySalesByStoreSp(PagedMonthlySalesByStoreResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedMonthlySalesByStoreResultRequestSpDto, GetMonthlySalesByStoreSpDto>(input, "[dbo].[GetMonthlySalesByStore]");


        // 6. Order Count by Status
        public async Task<List<GetOrderCountByStatusSpDto>> GetOrderCountByStatusSp(PagedOrderCountByStatusByStoreResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedOrderCountByStatusByStoreResultRequestSpDto, GetOrderCountByStatusSpDto>(input, "[dbo].[GetOrderCountByStatus]");

      
        public async Task<List<GetRecentOrdersByStoreSpDto>> GetRecentOrdersByStoreSp(PagedRecentOrdersByStoreResultRequestSpDto input)
         => await ExecuteSearchStoreProcedureWithOutPagination<PagedRecentOrdersByStoreResultRequestSpDto, GetRecentOrdersByStoreSpDto>(
        input, "[dbo].[GetRecentOrdersByStore]");

        public async Task<List<GetTotalOrdersSpDto>> GetTotalOrdersSp(PagedTotalOrdersResultRequestSpDto input)
          => await ExecuteSearchStoreProcedureWithOutPagination<PagedTotalOrdersResultRequestSpDto, GetTotalOrdersSpDto>(input, "[dbo].[GetTotalOrders]");

        public async Task<List<GetTotalSalesSpDto>> GetTotalSalesSp(PagedTotalSalesResultRequestSpDto input)
         => await ExecuteSearchStoreProcedureWithOutPagination<PagedTotalSalesResultRequestSpDto, GetTotalSalesSpDto>(input, "[dbo].[GetTotalSales]");


       
        public async Task<List<GetTopSellingProductsSpDto>> GetTopSellingProductsSp(PagedTopSellingProductsResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedTopSellingProductsResultRequestSpDto, GetTopSellingProductsSpDto>(
                input, "[dbo].[GetTopSellingProducts]");


        
        public async Task<List<GetMonthlySalesAllStoresSpDto>> GetMonthlySalesAllStoresSp(PagedMonthlySalesAllStoresResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedMonthlySalesAllStoresResultRequestSpDto, GetMonthlySalesAllStoresSpDto>(
                input, "[dbo].[GetMonthlySalesAllStores]");

        



        public async Task<List<GetTotalOrderCountByStatusSpDto>> GetTotalOrderCountByStatusSp(PagedTotalOrderCountByStatusResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedTotalOrderCountByStatusResultRequestSpDto, GetTotalOrderCountByStatusSpDto>(
                input, "[dbo].[GetTotalOrderCountByStatus]");

        


    }
}

