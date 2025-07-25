using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace ShopNowAngular.Stores.Dtos
{
    [AutoMapFrom(typeof(Store))]
    public class GetStoreDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public long OwnerId { get; set; }
    }
}
