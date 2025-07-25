using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using ShopNowAngular.ProductReviews.Dtos;
using ShopNowAngular.Products;
using ShopNowAngular.Repositories.ProductManagement.ProductReviews;
using ShopNowAngular.Repositories.ProductManagement.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.ProductReviews
{
    public class ProductReviewAppService : AsyncCrudAppService<ProductReview, GetProductReviewDto, Guid, PagedProductReviewResultRequestDto, CreateProductReviewDto, UpdateProductReviewDto>, IProductReviewsAppService
    {
        
        public ProductReviewAppService(IRepository<ProductReview, Guid> repository) : base(repository)
        {
            
        }

        
        public override Task<GetProductReviewDto> CreateAsync(CreateProductReviewDto input)
        {
            return base.CreateAsync(input);
        }

        public override Task DeleteAsync(EntityDto<Guid> input)
        {
            return base.DeleteAsync(input);
        }

        public override Task<PagedResultDto<GetProductReviewDto>> GetAllAsync(PagedProductReviewResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetProductReviewDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetProductReviewDto> UpdateAsync(UpdateProductReviewDto input)
        {
            return base.UpdateAsync(input);
        }

        protected override Task<ProductReview> GetEntityByIdAsync(Guid id)
        {
            return base.GetEntityByIdAsync(id);
        }
    }
}
