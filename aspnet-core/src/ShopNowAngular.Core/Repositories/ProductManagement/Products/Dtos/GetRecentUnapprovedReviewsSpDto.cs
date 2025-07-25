using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.ProductManagement.Products.Dtos
{
    public class GetRecentUnapprovedReviewsSpDto
    {
        public string UserName { get; set; }
        public string ProductName { get; set; }
        public int Rating { get; set; }
        public string ReviewText { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
