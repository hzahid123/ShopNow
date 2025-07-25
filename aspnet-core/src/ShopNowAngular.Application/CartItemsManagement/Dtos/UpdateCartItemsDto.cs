using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ShopNowAngular.Carts;
using System;

namespace ShopNowAngular.CartItemsManagement.Dtos
{
    [AutoMapTo(typeof(CartItem))]

    public class UpdateCartItemsDto:EntityDto<Guid>
    {
        public Guid CartId { get; set; }
        public Guid ProductId { get; set; }
        public double Quantity { get; set; }

    }
}
