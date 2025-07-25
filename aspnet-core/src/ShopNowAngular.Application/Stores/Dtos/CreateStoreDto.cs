using Abp.AutoMapper;

namespace ShopNowAngular.Stores.Dtos
{
    [AutoMapTo(typeof(Store))]
    public class CreateStoreDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public long OwnerId { get; set; }
    }
}
