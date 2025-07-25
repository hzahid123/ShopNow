using Abp.Application.Services;
using ShopNowAngular.Products.Dtos;
using System;

namespace ShopNowAngular.Products
{
    public interface IProductAppService : IAsyncCrudAppService<GetProductDto, Guid, PagedProductResultRequestDto, CreateProductDto, UpdateProductDto>
    {
    }
}
