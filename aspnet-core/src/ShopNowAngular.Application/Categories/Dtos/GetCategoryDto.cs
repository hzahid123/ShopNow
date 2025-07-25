using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace ShopNowAngular.Categories.Dtos
{
    [AutoMapFrom(typeof(Category))]
    public class GetCategoryDto : EntityDto<Guid>
    {
        public string Name { get; set; }
    }
}
