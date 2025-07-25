using Abp.Application.Services;
using System;
using System.Threading.Tasks;
using ShopNowAngular.SubCategories.Dtos;
using Abp.Domain.Repositories;
using Abp.Application.Services.Dto;

namespace ShopNowAngular.SubCategories
{
    public class SubCategoryAppService : AsyncCrudAppService<SubCategory, GetSubCategoryDto, Guid, PagedSubCategoryResultRequestDto, CreateSubCategoryDto, UpdateSubCategoryDto>, ISubCategoryAppService
    {
        public SubCategoryAppService(IRepository<SubCategory, Guid> repository) : base(repository)
        {
        }

        public override Task<GetSubCategoryDto> CreateAsync(CreateSubCategoryDto input)
        {
            return base.CreateAsync(input);
        }

        public override Task DeleteAsync(EntityDto<Guid> input)
        {
            return base.DeleteAsync(input);
        }

        public override Task<PagedResultDto<GetSubCategoryDto>> GetAllAsync(PagedSubCategoryResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetSubCategoryDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetSubCategoryDto> UpdateAsync(UpdateSubCategoryDto input)
        {
            return base.UpdateAsync(input);
        }

        protected override Task<SubCategory> GetEntityByIdAsync(Guid id)
        {
            return base.GetEntityByIdAsync(id);
        }
    }
}
