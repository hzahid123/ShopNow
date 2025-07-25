using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.Carts
{
    [Table("Carts", Schema = "Cart")]
    public class Cart : FullAuditedEntity<Guid>
    {
        public long CustomerId { get; set; }
        public User User { get; set; }
       

        public ICollection<CartItem> CartItems { get; set; }
    }
}
