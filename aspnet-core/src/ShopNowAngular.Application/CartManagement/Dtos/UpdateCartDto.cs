using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ShopNowAngular.Carts;
using System;

namespace ShopNowAngular.CartManagement.Dtos
{
    [AutoMapTo(typeof(Cart))]

    public class UpdateCartDto:EntityDto<Guid>
    {
        public long UserId { get; set; }
        public Guid StoreId { get; set; }
    }
}
