using Abp.Domain.Entities.Auditing;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopNowAngular.StoreRequests
{
    [Table("StoreRequests", Schema = "Store")]
    public class StoreRequest : FullAuditedEntity<Guid>
    {
        public string StoreName { get; set; }
        public string OwnerEmail { get; set; }
        public string OwnerName { get; set; }
        public string OwnerSurname { get; set; }
        public long? StoreOwnerId { get; set; } 
        public User StoreOwner {  get; set; }
        public StoreRequestStatus StorerequestStatus { get; set; }
    }
}
