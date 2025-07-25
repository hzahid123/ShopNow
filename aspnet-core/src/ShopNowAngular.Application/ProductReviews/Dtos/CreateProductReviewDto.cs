using Abp.AutoMapper;
using ShopNowAngular.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.ProductReviews.Dtos
{
    [AutoMapTo(typeof(ProductReview))]
    public class CreateProductReviewDto
    {
        public Guid StoreId { get; set; }
        public long CustomerId { get; set; }
        public Guid ProductId { get; set; }
        public int Rating { get; set; } // 1 to 5
        public string ReviewText { get; set; }
        public bool IsApproved { get; set; }
    }
}
