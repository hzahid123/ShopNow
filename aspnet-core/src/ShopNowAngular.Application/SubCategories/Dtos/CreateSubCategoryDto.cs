using Abp.AutoMapper;
using System;

namespace ShopNowAngular.SubCategories.Dtos
{
    [AutoMapTo(typeof(SubCategory))]
    public class CreateSubCategoryDto
    {
        public string Name { get; set; }
        public Guid CategoryId { get; set; }
    }
}
