using Abp.Application.Services;
using ShopNowAngular.OrderManagement.Dtos;
using System;

namespace ShopNowAngular.OrderManagement
{
    public interface IOrderAppService : IAsyncCrudAppService<GetOrderDto, Guid, PagedOrderResultRequestDto, CreateOrderDto, UpdateOrderDto>

    {
    }
}
