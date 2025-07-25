using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace ShopNowAngular.Categories.Dtos
{
    [AutoMapTo(typeof(Category))]
    public class UpdateCategoryDto : EntityDto<Guid>
    {
        public string Name { get; set; }
    }
}
