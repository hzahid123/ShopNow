using Abp.Application.Services.Dto;
using ShopNowAngular.Repositories.OrderManagement.Orders.Dtos;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.StoreManagement.Stores.Dtos;
using ShopNowAngular.Repositories.Users.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.OrderManagement.Orders
{
    public interface IOrderRepository
    {
        Task<List<GetTotalSalesByStoreSpDto>> GetTotalSalesByStoreSp(GetTotalSalesByStorePagedRequestSpDto input);


        Task<List<GetTotalOrdersByStoreSpDto>> GetTotalOrdersByStoreSp(PagedTotalOrdersByStoreResultRequestSpDto input);


        Task<List<GetTotalCustomersByStoreSpDto>> GetTotalCustomersByStoreSp(GetTotalCustomersByStorePagedRequestSpDto input);



        Task<List<GetMonthlySalesByStoreSpDto>> GetMonthlySalesByStoreSp(PagedMonthlySalesByStoreResultRequestSpDto input);


        Task<List<GetOrderCountByStatusSpDto>> GetOrderCountByStatusSp(PagedOrderCountByStatusByStoreResultRequestSpDto input);

        Task<List<GetRecentOrdersByStoreSpDto>> GetRecentOrdersByStoreSp(PagedRecentOrdersByStoreResultRequestSpDto input);

        Task<List<GetTotalOrdersSpDto>> GetTotalOrdersSp(PagedTotalOrdersResultRequestSpDto input);

        Task<List<GetTotalSalesSpDto>> GetTotalSalesSp(PagedTotalSalesResultRequestSpDto input);



        Task<List<GetTopSellingProductsSpDto>> GetTopSellingProductsSp(PagedTopSellingProductsResultRequestSpDto input);
        Task<List<GetMonthlySalesAllStoresSpDto>> GetMonthlySalesAllStoresSp(PagedMonthlySalesAllStoresResultRequestSpDto input);
        Task<List<GetTotalOrderCountByStatusSpDto>> GetTotalOrderCountByStatusSp(PagedTotalOrderCountByStatusResultRequestSpDto input);
    }
       



}
