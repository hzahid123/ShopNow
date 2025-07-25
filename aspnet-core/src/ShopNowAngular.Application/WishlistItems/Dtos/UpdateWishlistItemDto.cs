using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace ShopNowAngular.WishlistItems.Dtos
{
    [AutoMapTo(typeof(WishlistItem))]
    public class UpdateWishlistItemDto : EntityDto<Guid>
    {
        public Guid Id { get; set; }
    }
}
