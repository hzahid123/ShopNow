using Abp.Application.Services.Dto;
using ShopNowAngular.Repositories.OrderManagement.Orders.Dtos;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.StoreManagement.Stores.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.ProductManagement.Products
{
    public interface IProductRepository
    {
        Task<PagedResultDto<GetProductsRequestSpDto>> GetAllProductsSP(PagedProductsRequestResultRequestSpDto input);
        Task<PagedResultDto<GetProductsByStoreSpDto>> GetProductsByStoreSp(PagedProductsByStoreResultRequestSpDto input);

        Task<List<GetTopProductsByStoreSpDto>> GetTopProductsByStoreSp(PagedTopProductsByStoreResultRequestSpDto input);

        Task<PagedResultDto<GetProductsByCategorySpDto>> GetProductsByCategorySp(PagedProductsByCategoryResultRequestSpDto input);


        
        Task<List<GetRecentUnapprovedReviewsSpDto>> GetRecentUnapprovedReviewsSp(PagedRecentUnapprovedReviewsResultRequestSpDto input);



        Task<List<GetTotalWishlistItemsSpDto>> GetTotalWishlistItemsSp(PagedTotalWishlistItemsResultRequestSpDto input);



        Task<List<GetTopWishlistedProductsSpDto>> GetTopWishlistedProductsSp(PagedTopWishlistedProductsResultRequestSpDto input);

        Task<PagedResultDto<GetProductsBySubCategorySpDto>> GetProductsBySubCategorySp(PagedProductsBySubCategoryResultRequestSpDto input);

        Task<PagedResultDto<GetProductsBySubSubCategorySpDto>> GetProductsBySubSubCategorySp(PagedProductsBySubSubCategoryResultRequestSpDto input);




    }
}
