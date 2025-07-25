using Abp.Application.Services.Dto;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Enums;
using System;

namespace ShopNowAngular.StoresRequestManagement.Dtos
{
    public class UpdateStoreRequestDto:EntityDto<Guid>
    {
        public string StoreName { get; set; }
        public string OwnerEmail { get; set; }
        public string OwnerName { get; set; }
        public string OwnerSurname { get; set; }
        public long? StoreOwnerId { get; set; }
        public User StoreOwner { get; set; }
        public StoreRequestStatus StorerequestStatus { get; set; }
    }
}
