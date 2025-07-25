using Abp.Application.Services.Dto;
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
    public class UpdateProductReviewDto : EntityDto<Guid>
    {
        public Guid Id { get; set; }

        public int Rating { get; set; }
        public string ReviewText { get; set; }
        public bool IsApproved { get; set; } // For Admin to approve / edit
    }
}
