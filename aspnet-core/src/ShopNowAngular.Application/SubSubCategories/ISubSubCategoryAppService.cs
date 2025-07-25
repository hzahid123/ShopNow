using Abp.Application.Services;
using ShopNowAngular.SubSubCategories.Dtos;
using System;

namespace ShopNowAngular.SubSubCategories
{
    public interface ISubSubCategoryAppService : IAsyncCrudAppService<GetSubSubCategoryDto, Guid, PagedSubSubCategoryResultRequestDto, CreateSubSubCategoryDto, UpdateSubSubCategoryDto>
    {
    }
}
