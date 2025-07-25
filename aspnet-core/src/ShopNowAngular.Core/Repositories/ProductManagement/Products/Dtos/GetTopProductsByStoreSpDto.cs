using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.ProductManagement.Products.Dtos
{
    public class GetTopProductsByStoreSpDto
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public string Category { get; set; }
        public double TotalSold { get; set; }
    }
}
