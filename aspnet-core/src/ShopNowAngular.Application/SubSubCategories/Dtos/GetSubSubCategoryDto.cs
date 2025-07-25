using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace ShopNowAngular.SubSubCategories.Dtos
{
    [AutoMapFrom(typeof(SubSubCategory))]
    public class GetSubSubCategoryDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid SubCategoryId { get; set; }
    }
}
