using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ShopNowAngular.Products;
using ShopNowAngular.SubCategories;
using System;

namespace ShopNowAngular.PaymentManagement.Dtos
{
    [AutoMapTo(typeof(Product))]

    public class UpdatePaymentDto:EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public double StockQuantity { get; set; }
        public Guid CategoryId { get; set; }
        public Guid? SubCategoryId { get; set; }
        public SubCategory SubCategory { get; set; }
        public Guid? SubSubCategoryId { get; set; }
        public Guid StoreId { get; set; }
    }
}
