using Abp.Application.Services;
using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using ShopNowAngular.Carts;
using ShopNowAngular.CartItemsManagement.Dtos;
using Abp.Application.Services.Dto;

namespace ShopNowAngular.CartItemsManagement
{
    public class CartItemsAppService : AsyncCrudAppService<CartItem, GetCartItemsDto, Guid, PagedCartItemsResultRequestDto, CreateCartItemsDto, UpdateCartItemsDto>, ICartItemsAppService
    {
        public CartItemsAppService(IRepository<CartItem, Guid> repository) : base(repository)
        {
        }

        public override Task<GetCartItemsDto> CreateAsync(CreateCartItemsDto input)
        {
            return base.CreateAsync(input);
        }

        public override Task DeleteAsync(EntityDto<Guid> input)
        {
            return base.DeleteAsync(input);
        }

        public override Task<PagedResultDto<GetCartItemsDto>> GetAllAsync(PagedCartItemsResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetCartItemsDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetCartItemsDto> UpdateAsync(UpdateCartItemsDto input)
        {
            return base.UpdateAsync(input);
        }
    }
}
