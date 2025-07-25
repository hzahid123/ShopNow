using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace ShopNowAngular.SubCategories.Dtos
{
    [AutoMapTo(typeof(SubCategory))]
    public class UpdateSubCategoryDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public Guid CategoryId { get; set; }
    }
}
