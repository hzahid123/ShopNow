using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace ShopNowAngular.SubCategories.Dtos
{
    [AutoMapFrom(typeof(SubCategory))]
    public class GetSubCategoryDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid CategoryId { get; set; }
    }
}
