using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using ShopNowAngular.PaymentManagement.Dtos;
using ShopNowAngular.Products;
using System;
using System.Threading.Tasks;

namespace ShopNowAngular.PaymentManagement
{
    public class PaymentAppService: AsyncCrudAppService<Product, GetPaymentDto, Guid, PagedPaymentResultRequestDto, CreatePaymentDto, UpdatePaymentDto>,IPaymentAppService
    {
        public PaymentAppService(IRepository<Product, Guid> repository) : base(repository)
        {
        }

        public override Task<GetPaymentDto> CreateAsync(CreatePaymentDto input)
        {
            return base.CreateAsync(input);
        }

        public override Task DeleteAsync(EntityDto<Guid> input)
        {
            return base.DeleteAsync(input);
        }

        public override Task<PagedResultDto<GetPaymentDto>> GetAllAsync(PagedPaymentResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetPaymentDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetPaymentDto> UpdateAsync(UpdatePaymentDto input)
        {
            return base.UpdateAsync(input);
        }
    }
}
