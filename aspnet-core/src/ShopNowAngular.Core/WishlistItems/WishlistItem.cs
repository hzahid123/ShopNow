using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Products;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.WishlistItems
{
    [Table("WishlistItems", Schema = "Cart")]
    public class WishlistItem : FullAuditedEntity<Guid>
    {
        public long CustomerId { get; set; } // Refers to AbpUser
        public  User User { get; set; }

        public Guid ProductId { get; set; }
        public  Product Product { get; set; }
    }
}
