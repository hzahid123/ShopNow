using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.ProductManagement.Products.Dtos
{
    public class GetTopWishlistedProductsSpDto
    {
        public string ProductName { get; set; }
        public int WishlistCount { get; set; }
    }

}
