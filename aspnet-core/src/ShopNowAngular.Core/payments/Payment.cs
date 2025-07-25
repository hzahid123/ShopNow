using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Enums;
using ShopNowAngular.orders;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.payments
{
    [Table("Payments", Schema = "Payment")]
    public class Payment : FullAuditedEntity<Guid>
    {
        public Guid OrderId { get; set; }
        public Order Order { get; set; }

        public long CustomerId { get; set; }
        public User User { get; set; }
        public double Amount { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        
    }
}
