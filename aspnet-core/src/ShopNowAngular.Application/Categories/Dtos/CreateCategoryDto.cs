using Abp.AutoMapper;

namespace ShopNowAngular.Categories.Dtos
{
    [AutoMapTo(typeof(Category))]
    public class CreateCategoryDto
    {
        public string Name { get; set; }
    }
}
