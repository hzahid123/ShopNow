using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Categories;
using ShopNowAngular.Stores;
using ShopNowAngular.SubCategories;
using ShopNowAngular.SubSubCategories;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.Products
{
    [Table("Products", Schema = "product")]
    public class Product : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public double StockQuantity { get; set; }

        public Guid CategoryId { get; set; }
        public Category Category { get; set; }

        public Guid? SubCategoryId { get; set; }
        public SubCategory SubCategory { get; set; }

        public Guid? SubSubCategoryId { get; set; }
        public SubSubCategory SubSubCategory { get; set; }
        public string Dimensions { get; set; }

        public Guid StoreId { get; set; }
        public Store Store { get; set; }
    }
}
