using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ShopNowAngular.Carts;
using System;

namespace ShopNowAngular.CartItemsManagement.Dtos
{
    [AutoMapFrom(typeof(CartItem))]

    public class GetCartItemsDto:EntityDto<Guid>
    {
        public Guid CartId { get; set; }
        public Guid ProductId { get; set; }
        public double Quantity { get; set; }
    }
}
