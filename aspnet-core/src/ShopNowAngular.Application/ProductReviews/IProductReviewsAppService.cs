using Abp.Application.Services;
using ShopNowAngular.ProductReviews.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.ProductReviews
{
    public interface IProductReviewsAppService : IAsyncCrudAppService<GetProductReviewDto,Guid,PagedProductReviewResultRequestDto,CreateProductReviewDto,UpdateProductReviewDto>
    {
    }
}
