using Abp.AutoMapper;
using System;

namespace ShopNowAngular.SubSubCategories.Dtos
{
    [AutoMapTo(typeof(SubSubCategory))]
    public class CreateSubSubCategoryDto
    {
        public string Name { get; set; }
        public Guid SubCategoryId { get; set; }
    }
}
