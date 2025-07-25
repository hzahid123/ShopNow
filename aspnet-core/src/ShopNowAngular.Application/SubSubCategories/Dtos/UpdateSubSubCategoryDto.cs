using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace ShopNowAngular.SubSubCategories.Dtos
{
    [AutoMapTo(typeof(SubSubCategory))]
    public class UpdateSubSubCategoryDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid SubCategoryId { get; set; }
    }
}
