using Abp.Application.Services;
using ShopNowAngular.SubCategories.Dtos;
using System;

namespace ShopNowAngular.SubCategories
{
    public interface ISubCategoryAppService : IAsyncCrudAppService<GetSubCategoryDto, Guid, PagedSubCategoryResultRequestDto, CreateSubCategoryDto, UpdateSubCategoryDto>
    {
    }
}
