using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ShopNowAngular.Carts;
using System;

namespace ShopNowAngular.CartManagement.Dtos
{
    [AutoMapFrom(typeof(Cart))]

    public class GetCartDto:EntityDto<Guid>
    {
        public long UserId { get; set; }
        public Guid StoreId { get; set; }
    }
}
