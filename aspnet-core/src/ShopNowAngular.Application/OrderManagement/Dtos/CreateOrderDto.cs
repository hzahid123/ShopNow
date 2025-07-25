using Abp.AutoMapper;
using ShopNowAngular.Enums;
using ShopNowAngular.OrderItemsManagement.Dtos;
using ShopNowAngular.orders;
using System;
using System.Collections.Generic;

namespace ShopNowAngular.OrderManagement.Dtos
{
    [AutoMapTo(typeof(Order))]

    public class CreateOrderDto
    {
        public long UserId { get; set; }

        public Guid StoreId { get; set; }

        public double TotalAmount { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public List<CreateOrderItemsDto> OrderItems { get; set; }

    }
}
