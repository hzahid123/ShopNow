using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Products;
using ShopNowAngular.SubCategories;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.SubSubCategories
{
    [Table("SubSubCategories", Schema = "Category")]

    public class SubSubCategory : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }

        public Guid SubCategoryId { get; set; }

        public SubCategory SubCategory { get; set; }
        public ICollection<Product> Products { get; set; }

        public SubSubCategory()
        {
            Products = new List<Product>();
        }
    }
}
