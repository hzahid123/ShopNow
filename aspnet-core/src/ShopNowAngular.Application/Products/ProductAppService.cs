using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using ShopNowAngular.Carts;
using ShopNowAngular.orders;
using ShopNowAngular.ProductReviews;
using ShopNowAngular.Products.Dtos;
using ShopNowAngular.Repositories.ProductManagement.Products;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.WishlistItems;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopNowAngular.Products
{
    public class ProductAppService : AsyncCrudAppService<Product, GetProductDto, Guid, PagedProductResultRequestDto, CreateProductDto, UpdateProductDto>, IProductAppService
    {
        private readonly IRepository<WishlistItem, Guid> _WishlistItemRepository;
        private readonly IRepository<OrderItem, Guid> _orderItemRepository;
        private readonly IRepository<CartItem, Guid> _cartItemRepository;
        private readonly IRepository<ProductReview, Guid> _productReviewRepository;
        private readonly IProductRepository _producrRepository;
        public ProductAppService(IRepository<Product, Guid> repository, IRepository<WishlistItem, Guid> WishlistItemRepository, IRepository<OrderItem, Guid> orderItemRepository, IRepository<CartItem, Guid> cartItemRepository, IRepository<ProductReview, Guid> productReviewRepository, IProductRepository producrRepository) : base(repository)
        {
            _producrRepository = producrRepository;
            _orderItemRepository = orderItemRepository;
            _cartItemRepository= cartItemRepository;
            _productReviewRepository = productReviewRepository;
            _WishlistItemRepository = WishlistItemRepository;
        }

        public async Task<PagedResultDto<GetProductsRequestSpDto>> GetAllProducts(PagedProductsRequestResultRequestSpDto input)
        {
            var data = await _producrRepository.GetAllProductsSP(input);
            return data;
        }
        public override Task<GetProductDto> CreateAsync(CreateProductDto input)
        {
            return base.CreateAsync(input);
        }

      


        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
           
                var productId = input.Id;

                // 1. Delete WishlistItems
                await _WishlistItemRepository.DeleteAsync(x => x.ProductId == productId);

                // 2. Delete OrderItems (optional: only if order not shipped/delivered)
                await _orderItemRepository.DeleteAsync(x => x.ProductId == productId);

                // 3. Delete from CartItems (if exists)
                await _cartItemRepository.DeleteAsync(x => x.ProductId == productId);

                // 4. Delete Product Reviews (if implemented)
                await _productReviewRepository.DeleteAsync(x => x.ProductId == productId);

                // 5. Delete the Product itself
                await base.DeleteAsync(input);
            
            
        }



        public override Task<PagedResultDto<GetProductDto>> GetAllAsync(PagedProductResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetProductDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetProductDto> UpdateAsync(UpdateProductDto input)
        {
            return base.UpdateAsync(input);
        }

        protected override Task<Product> GetEntityByIdAsync(Guid id)
        {
            return base.GetEntityByIdAsync(id);

        }
        public async Task<PagedResultDto<GetProductsByStoreSpDto>> GetProductsByStore(PagedProductsByStoreResultRequestSpDto input)
        {
            
                var data = await _producrRepository.GetProductsByStoreSp(input);
                return data;

        }



        public async Task<List<GetTopProductsByStoreSpDto>> GetTopProductsByStore(PagedTopProductsByStoreResultRequestSpDto input)
        {
           
                var data = await _producrRepository.GetTopProductsByStoreSp(input);
                return data;
           
        }

        public async Task<PagedResultDto<GetProductsByCategorySpDto>> GetProductsByCategory(PagedProductsByCategoryResultRequestSpDto input)
        {
            var data = await _producrRepository.GetProductsByCategorySp(input);
            return data;
        }

        public async Task<List<GetRecentUnapprovedReviewsSpDto>> GetRecentUnapprovedReviews(PagedRecentUnapprovedReviewsResultRequestSpDto input)
        {
            var data = await _producrRepository.GetRecentUnapprovedReviewsSp(input);
            return data;
        }

        public async Task<List<GetTotalWishlistItemsSpDto>> GetTotalWishlistItems(PagedTotalWishlistItemsResultRequestSpDto input)
        {
            var data = await _producrRepository.GetTotalWishlistItemsSp(input);
            return data;
        }

        public async Task<List<GetTopWishlistedProductsSpDto>> GetTopWishlistedProducts(PagedTopWishlistedProductsResultRequestSpDto input)
        {
            var data = await _producrRepository.GetTopWishlistedProductsSp(input);
            return data;
        }

        public async Task<PagedResultDto<GetProductsBySubCategorySpDto>> GetProductsBySubCategory(PagedProductsBySubCategoryResultRequestSpDto input)
        {
            var data = await _producrRepository.GetProductsBySubCategorySp(input);
            return data;
        }

        public async Task<PagedResultDto<GetProductsBySubSubCategorySpDto>> GetProductsBySubSubCategory(PagedProductsBySubSubCategoryResultRequestSpDto input)
        {
            var data = await _producrRepository.GetProductsBySubSubCategorySp(input);
            return data;
        }


    }

}
