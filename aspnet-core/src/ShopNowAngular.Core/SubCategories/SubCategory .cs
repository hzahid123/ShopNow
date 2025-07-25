using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Categories;
using ShopNowAngular.SubSubCategories;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.SubCategories
{
    [Table("SubCategories", Schema = "Category")]
    public class SubCategory : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public Guid CategoryId { get; set; }

        public Category Category { get; set; }
        public ICollection<SubSubCategory> SubSubCategories { get; set; }

        public SubCategory()
        {
            SubSubCategories = new List<SubSubCategory>();
        }
    }
}
