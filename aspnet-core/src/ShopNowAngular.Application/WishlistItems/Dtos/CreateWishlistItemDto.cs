using Abp.AutoMapper;
using ShopNowAngular.StoreFollowers;
using System;

namespace ShopNowAngular.WishlistItems.Dtos
{
    [AutoMapTo(typeof(WishlistItem))]
    public class CreateWishlistItemDto
    {
        public Guid ProductId { get; set; }
        public long CustomerId { get; set; }
    }
}
