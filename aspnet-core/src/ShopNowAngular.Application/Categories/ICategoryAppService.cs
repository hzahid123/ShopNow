using Abp.Application.Services;
using ShopNowAngular.Categories.Dtos;
using System;

namespace ShopNowAngular.Categories
{
    public interface ICategoryAppService : IAsyncCrudAppService<GetCategoryDto, Guid, PagedCategoryResultRequestDto, CreateCategoryDto, UpdateCategoryDto>
    {
    }
}
