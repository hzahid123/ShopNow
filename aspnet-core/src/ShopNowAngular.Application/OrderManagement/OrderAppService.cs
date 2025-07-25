using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using ShopNowAngular.OrderManagement.Dtos;
using ShopNowAngular.orders;
using ShopNowAngular.Repositories.OrderManagement.Orders;
using ShopNowAngular.Repositories.OrderManagement.Orders.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;






namespace ShopNowAngular.OrderManagement
{
    public class OrderAppService : AsyncCrudAppService<Order, GetOrderDto, Guid, PagedOrderResultRequestDto, CreateOrderDto, UpdateOrderDto>, IOrderAppService
    {
        private readonly IRepository<OrderItem, Guid> _orderItemRepository;
        private readonly IOrderRepository _orderRepository;

        public OrderAppService(
            IRepository<Order, Guid> repository,
            IRepository<OrderItem, Guid> orderItemRepository,
            IOrderRepository orderRepository
        ) : base(repository)
        {
            _orderItemRepository = orderItemRepository;
            _orderRepository = orderRepository;
        }


        public override Task<GetOrderDto> CreateAsync(CreateOrderDto input)
        {
            return base.CreateAsync(input);
        }

        public async Task<GetOrderDto> CreateOrder(CreateOrderDto input)
        {
            var order = ObjectMapper.Map<Order>(input);
            order.Id = Guid.NewGuid();
            order.CreationTime = DateTime.Now;
            order.OrderItems = new List<OrderItem>();

            double totalAmount = 0;

            // Process each OrderItem and calculate total
            foreach (var item in input.OrderItems)
            {
                var itemTotal = item.Quantity * item.UnitPrice;
                totalAmount += itemTotal;

                var orderItem = new OrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                };
                order.TotalAmount = totalAmount;

                await _orderItemRepository.InsertAsync(orderItem);
                order.OrderItems.Add(orderItem);
            }

            order.TotalAmount = totalAmount;

            await Repository.InsertAsync(order);
            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<GetOrderDto>(order);
        }

        public override Task DeleteAsync(EntityDto<Guid> input)
        {
            return base.DeleteAsync(input);
        }

        public override Task<PagedResultDto<GetOrderDto>> GetAllAsync(PagedOrderResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetOrderDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetOrderDto> UpdateAsync(UpdateOrderDto input)
        {
            return base.UpdateAsync(input);
        }
        // 1. Total Sales
        public async Task<List<GetTotalSalesByStoreSpDto>> GetTotalSalesByStore(GetTotalSalesByStorePagedRequestSpDto input)
        {
                var data = await _orderRepository.GetTotalSalesByStoreSp(input);
                return data;
            
        }

        // 2. Total Orders
        public async Task<List<GetTotalOrdersByStoreSpDto>> GetTotalOrdersByStore(PagedTotalOrdersByStoreResultRequestSpDto input)
        {
            
                var data = await _orderRepository.GetTotalOrdersByStoreSp(input);
                return data;
            
        }

        // 3. Total Customers
        public async Task<List<GetTotalCustomersByStoreSpDto>> GetTotalCustomersByStore(GetTotalCustomersByStorePagedRequestSpDto input)
        {
            
                var data = await _orderRepository.GetTotalCustomersByStoreSp(input);
                 return data;
           
        }

        // 4. Monthly Sales
        public async Task<List<GetMonthlySalesByStoreSpDto>> GetMonthlySalesByStore(PagedMonthlySalesByStoreResultRequestSpDto input)
        {
            
                var data = await _orderRepository.GetMonthlySalesByStoreSp(input);
                return data;
            
        }

        // 5. Monthly Order Status
        public async Task<List<GetOrderCountByStatusSpDto>> GetOrderCountByStatus(PagedOrderCountByStatusByStoreResultRequestSpDto input)
        {
            
                var data = await _orderRepository.GetOrderCountByStatusSp(input);
                return data;
            
        }

        // 6. Recent Orders
        public async Task<List<GetRecentOrdersByStoreSpDto>> GetRecentOrdersByStore(PagedRecentOrdersByStoreResultRequestSpDto input)
        {
            
                var data = await _orderRepository.GetRecentOrdersByStoreSp(input);
                return data;
            
        }

        public async Task<List<GetTotalOrdersSpDto>> GetTotalOrders(PagedTotalOrdersResultRequestSpDto input)
        {
            var data = await _orderRepository.GetTotalOrdersSp(input);
            return data;
        }

        public async Task<List<GetTotalSalesSpDto>> GetTotalSales(PagedTotalSalesResultRequestSpDto input)
        {
            var data = await _orderRepository.GetTotalSalesSp(input);
            return data;
        }

        public async Task<List<GetTopSellingProductsSpDto>> GetTopSellingProducts(PagedTopSellingProductsResultRequestSpDto input)
        {
            
            
                var data = await _orderRepository.GetTopSellingProductsSp(input);
                return data;
            
            
        }

        public async Task<List<GetMonthlySalesAllStoresSpDto>> GetMonthlySalesAllStores(PagedMonthlySalesAllStoresResultRequestSpDto input)
        {
            
                var data = await _orderRepository.GetMonthlySalesAllStoresSp(input);
                return data;
           
        }



        public async Task<List<GetTotalOrderCountByStatusSpDto>> GetTotalOrderCountByStatus(PagedTotalOrderCountByStatusResultRequestSpDto input)
        {
            var data = await _orderRepository.GetTotalOrderCountByStatusSp(input);
            return data;
        }

    }


}



   
        



 
