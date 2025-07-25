using Abp.Domain.Entities.Auditing;
using ShopNowAngular.SubCategories;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.Categories
{
    [Table("Categories", Schema = "Category")]
    public class Category : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }


        public ICollection<SubCategory> SubCategories { get; set; }

        public Category()
        {
            SubCategories = new List<SubCategory>();
        }

    }
}
