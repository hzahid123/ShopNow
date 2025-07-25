using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Products;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.Carts
{
    [Table("CartItems", Schema = "Cart")]
    public class CartItem : FullAuditedEntity<Guid>
    {
        public Guid CartId { get; set; }
        public Product Product { get; set; }
        public Guid ProductId { get; set; }
        public double Quantity { get; set; }

    }
}
