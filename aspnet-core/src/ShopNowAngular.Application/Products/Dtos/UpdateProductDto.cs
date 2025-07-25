using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using System;

namespace ShopNowAngular.Products.Dtos
{
    [AutoMapTo(typeof(Product))]
    public class UpdateProductDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int StockQuantity { get; set; }
        public Guid CategoryId { get; set; }
        public Guid? SubCategoryId { get; set; }
        public Guid? SubSubCategoryId { get; set; }
        public Guid StoreId { get; set; }
        public string Dimensions { get; set; }
    }
}
