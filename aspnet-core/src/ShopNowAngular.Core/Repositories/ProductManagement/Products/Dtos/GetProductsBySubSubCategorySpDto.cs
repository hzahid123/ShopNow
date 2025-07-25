using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.ProductManagement.Products.Dtos
{
    public class GetProductsBySubSubCategorySpDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public double StockQuantity { get; set; }
        public string Dimensions { get; set; }

        public string Category { get; set; }
        public string SubCategory { get; set; }
        public string SubSubCategory { get; set; }
    }

}
