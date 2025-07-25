using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.ProductReviews.Dtos
{
    public class PagedProductReviewResultRequestDto
    {
        public Guid? ProductId { get; set; } // Filter by product
        public bool? IsApproved { get; set; } // Filter by approval status
    }
}
