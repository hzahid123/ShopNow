using Abp.Application.Services.Dto;
using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.orders;
using ShopNowAngular.Products;
using ShopNowAngular.Repositories.OrderManagement.Orders.Dtos;
using ShopNowAngular.Repositories.ProductManagement.Categories.Dtos;
using ShopNowAngular.Repositories.ProductManagement.Products;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.StoreManagement.Stores.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.ProductManagement.Products
{
    public class ProductRepository : ShopNowAngularRepositoryBase<Product, Guid>, IProductRepository
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public ProductRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }

        public async Task<PagedResultDto<GetProductsRequestSpDto>> GetAllProductsSP(PagedProductsRequestResultRequestSpDto input)
           => await ExecuteSearchStoreProcedure<PagedProductsRequestResultRequestSpDto, GetProductsRequestSpDto>(input, "[product].[GetAllProducts]");

        public async Task<PagedResultDto<GetProductsByStoreSpDto>> GetProductsByStoreSp(PagedProductsByStoreResultRequestSpDto input)
    => await ExecuteSearchStoreProcedure<PagedProductsByStoreResultRequestSpDto, GetProductsByStoreSpDto>(input, "[dbo].[GetProductsByStoreIdPagedSorted]");



        public async Task<List<GetTopProductsByStoreSpDto>> GetTopProductsByStoreSp(PagedTopProductsByStoreResultRequestSpDto input)
            =>  await ExecuteSearchStoreProcedureWithOutPagination<PagedTopProductsByStoreResultRequestSpDto, GetTopProductsByStoreSpDto>(input, "[dbo].[GetTopProductsByStore]");


        public async Task<PagedResultDto<GetProductsByCategorySpDto>> GetProductsByCategorySp(PagedProductsByCategoryResultRequestSpDto input)
         => await ExecuteSearchStoreProcedure< PagedProductsByCategoryResultRequestSpDto,GetProductsByCategorySpDto>( input, "[product].[GetProductsByCategory]");



      
        public async Task<List<GetRecentUnapprovedReviewsSpDto>> GetRecentUnapprovedReviewsSp(PagedRecentUnapprovedReviewsResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedRecentUnapprovedReviewsResultRequestSpDto, GetRecentUnapprovedReviewsSpDto>(
                input, "[dbo].[GetRecentUnapprovedReviews]");


        public async Task<List<GetTotalWishlistItemsSpDto>> GetTotalWishlistItemsSp(PagedTotalWishlistItemsResultRequestSpDto input)
            => await ExecuteSearchStoreProcedureWithOutPagination<PagedTotalWishlistItemsResultRequestSpDto, GetTotalWishlistItemsSpDto>(
        input, "[dbo].[GetTotalWishlistItems]");

        public async Task<List<GetTopWishlistedProductsSpDto>> GetTopWishlistedProductsSp(PagedTopWishlistedProductsResultRequestSpDto input)
               => await ExecuteSearchStoreProcedureWithOutPagination<PagedTopWishlistedProductsResultRequestSpDto, GetTopWishlistedProductsSpDto>(
        input, "[dbo].[GetTopWishlistedProducts]");


        public async Task<PagedResultDto<GetProductsBySubCategorySpDto>> GetProductsBySubCategorySp(PagedProductsBySubCategoryResultRequestSpDto input)
    => await ExecuteSearchStoreProcedure<PagedProductsBySubCategoryResultRequestSpDto, GetProductsBySubCategorySpDto>(
        input, "[product].[GetProductsBySubCategory]");


        public async Task<PagedResultDto<GetProductsBySubSubCategorySpDto>> GetProductsBySubSubCategorySp(PagedProductsBySubSubCategoryResultRequestSpDto input)
    => await ExecuteSearchStoreProcedure<PagedProductsBySubSubCategoryResultRequestSpDto, GetProductsBySubSubCategorySpDto>(
        input, "[product].[GetProductsBySubSubCategory]");





    }
}
    
