using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Products;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.orders
{
    [Table("OrderItems", Schema = "Order")]
    public class OrderItem : FullAuditedEntity<Guid>
    {
        public Guid OrderId { get; set; }
        public Product Product { get; set; }

        public Guid ProductId { get; set; }

        public double Quantity { get; set; }
        public double UnitPrice { get; set; }
 

    }
}
