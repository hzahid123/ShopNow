using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using ShopNowAngular.Products;
using ShopNowAngular.Products.Dtos;
using ShopNowAngular.Repositories.ProductManagement.Products;
using ShopNowAngular.Repositories.Wishlist;
using ShopNowAngular.WishlistItems.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopNowAngular.WishlistItems
{
    public class WishlistItemAppService : AsyncCrudAppService<WishlistItem, GetWishlistItemDto, Guid, PagedWishlistItemResultRequestDto, CreateWishlistItemDto, UpdateWishlistItemDto>, IWishlistItemAppService
    {
        private readonly IRepository<Product, Guid> _producrRepository;
        private readonly IWishlistItemRepository _WishlistItemRepository;
        public WishlistItemAppService(IRepository<WishlistItem, Guid> repository, IRepository<Product, Guid> producrRepository, IWishlistItemRepository WishlistItemRepository) : base(repository)
        {
            _producrRepository = producrRepository;
            _WishlistItemRepository = WishlistItemRepository;
        }
        public async Task AddToWishlistAsync(CreateWishlistItemDto input)
        {
            var userId = AbpSession.GetUserId();

            var exists = await Repository.FirstOrDefaultAsync(x =>
                x.CustomerId == userId && x.ProductId == input.ProductId);

            if (exists != null)
                throw new UserFriendlyException("Product already in wishlist.");

            await Repository.InsertAsync(new WishlistItem
            {
                CustomerId = userId,
                ProductId = input.ProductId
            });
        }

        public async Task RemoveFromWishlistAsync(RemoveFromWishlistInput input)
        {
            var userId = AbpSession.GetUserId();

            var item = await Repository.FirstOrDefaultAsync(x =>
                x.CustomerId == userId && x.ProductId == input.ProductId);

            if (item != null)
                await Repository.DeleteAsync(item.Id);
        }

        public async Task<List<GetProductDto>> GetMyWishlistAsync()
        {
            var userId = AbpSession.GetUserId();

            // Step 1: Fetch ProductIds from Wishlist
            var productIds = await Repository.GetAll()
                .Where(x => x.CustomerId == userId)
                .Select(x => x.ProductId)
                .ToListAsync();

            // Step 2: Fetch full product entities from _productRepository
            var products = await _producrRepository.GetAll()
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            // Step 3: Map to DTO
            return products
                .Select(p => ObjectMapper.Map<GetProductDto>(p))
                .ToList();
        }

    }
}
