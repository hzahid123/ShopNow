using Abp.AutoMapper;
using ShopNowAngular.orders;
using System;

namespace ShopNowAngular.OrderItemsManagement.Dtos
{
    [AutoMapTo(typeof(OrderItem))]

    public class CreateOrderItemsDto
    {
        public Guid OrderId { get; set; }

        public Guid ProductId { get; set; }
        public double UnitPrice { get; set; }
        public double Quantity { get; set; }
    }
}
