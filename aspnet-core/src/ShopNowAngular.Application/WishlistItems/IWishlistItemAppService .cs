using Abp.Application.Services;
using ShopNowAngular.StoreFollowers.Dtos;
using ShopNowAngular.WishlistItems.Dtos;
using System;

namespace ShopNowAngular.WishlistItems
{
    public interface IWishlistItemAppService : IAsyncCrudAppService<GetWishlistItemDto, Guid, PagedWishlistItemResultRequestDto, CreateWishlistItemDto, UpdateWishlistItemDto>
    {
    }
}
