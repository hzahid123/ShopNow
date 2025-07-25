using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Products;
using ShopNowAngular.Stores;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.ProductReviews
{
    [Table("ProductReviews", Schema = "Product")]
    public class ProductReview : FullAuditedEntity<Guid>
    {
        public long CustomerId { get; set; } // FK to AbpUsers.Id (long)
        public User User { get; set; }

        public Guid ProductId { get; set; } // FK to Product.Id
        public Product Product { get; set; }

        public int Rating { get; set; } // 1 to 5

        public string ReviewText { get; set; }

        public bool IsApproved { get; set; } // Moderation

        public Guid StoreId { get; set; } // FK to Store.Id
        public Store Store { get; set; }
    }
}
