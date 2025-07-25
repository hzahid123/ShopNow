using Abp.Application.Services;
using ShopNowAngular.orders;
using System;
using System.Threading.Tasks;
using ShopNowAngular.OrderItemsManagement.Dtos;
using Abp.Domain.Repositories;
using Abp.Application.Services.Dto;

namespace ShopNowAngular.OrderItemsManagement
{
    public class OrderItemsAppService : AsyncCrudAppService<OrderItem, GetOrderItemsDto, Guid, PagedOrderItemsResultRequestDto, CreateOrderItemsDto, UpdateOrderItemsDto>, IOrderItemsAppService
    {
        public OrderItemsAppService(IRepository<OrderItem, Guid> repository) : base(repository)
        {
        }

        public override Task<GetOrderItemsDto> CreateAsync(CreateOrderItemsDto input)
        {
            return base.CreateAsync(input);
        }

        public override Task DeleteAsync(EntityDto<Guid> input)
        {
            return base.DeleteAsync(input);
        }

        public override Task<PagedResultDto<GetOrderItemsDto>> GetAllAsync(PagedOrderItemsResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetOrderItemsDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetOrderItemsDto> UpdateAsync(UpdateOrderItemsDto input)
        {
            return base.UpdateAsync(input);
        }
    }
}
