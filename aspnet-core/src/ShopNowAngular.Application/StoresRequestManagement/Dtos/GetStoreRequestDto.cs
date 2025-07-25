using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Enums;
using ShopNowAngular.StoreRequests;
using System;

namespace ShopNowAngular.StoresRequestManagement.Dtos
{
    [AutoMapFrom(typeof(StoreRequest))]

    public class GetStoreRequestDto:EntityDto<Guid>
    {
        public string StoreName { get; set; }
        public string OwnerEmail { get; set; }
        public string OwnerName { get; set; }
        public string OwnerSurname { get; set; }
        public long? StoreOwnerId { get; set; }
        public User StoreOwner { get; set; }
        public Guid? Id { get; set; } = null;
        public StoreRequestStatus StorerequestStatus { get; set; }

    }
}
