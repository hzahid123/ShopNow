using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Stores;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.StoreFollowers
{
    [Table("StoreFollowers", Schema = "Store")]
    public class StoreFollower : FullAuditedEntity<Guid>
    {
        public Guid StoreId { get; set; }
        public  Store Store { get; set; }

        public long CustomerId { get; set; } // Customer (AbpUser)
        public  User User { get; set; }
    }
}
