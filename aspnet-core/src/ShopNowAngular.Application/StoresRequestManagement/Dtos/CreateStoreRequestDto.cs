using Abp.AutoMapper;
using ShopNowAngular.Enums;
using ShopNowAngular.StoreRequests;

namespace ShopNowAngular.StoresRequestManagement.Dtos
{
    [AutoMapTo(typeof(StoreRequest))]

    public class CreateStoreRequestDto
    {
        public string StoreName { get; set; }
        public string OwnerEmail { get; set; }
        public string OwnerName { get; set; }
        public string OwnerSurname { get; set; }
        public long? StoreOwnerId { get; set; }
        public StoreRequestStatus StorerequestStatus { get; set; }

    }
}
