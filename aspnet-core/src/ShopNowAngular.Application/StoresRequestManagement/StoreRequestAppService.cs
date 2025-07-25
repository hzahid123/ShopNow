using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using ShopNowAngular.Carts;
using ShopNowAngular.Enums;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.StoreManagement.StoreRequests;
using ShopNowAngular.Repositories.StoreManagement.StoreRequests.Dtos;
using ShopNowAngular.StoreRequests;
using ShopNowAngular.Stores;
using ShopNowAngular.StoresRequestManagement.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ShopNowAngular.StoresRequestManagement
{
    public class StoreRequestAppService: AsyncCrudAppService<StoreRequest, GetStoreRequestDto, Guid, PagedStoreRequestResultRequestDto, CreateStoreRequestDto, UpdateStoreRequestDto>, IStoreRequestAppService
    {
        private readonly IStoreRequestRepository _storeRequestRepository;
        private readonly IRepository<Store, Guid> _storeRepository;

        public StoreRequestAppService(IRepository<StoreRequest, Guid> repository,IRepository<Store, Guid> storeRepository, IStoreRequestRepository storeRequestRepository) : base(repository)
        {
            _storeRequestRepository = storeRequestRepository;
            _storeRepository = storeRepository;
        }

        public override async Task<GetStoreRequestDto> CreateAsync(CreateStoreRequestDto input)
        {
            // 🔎 Check if the store name already exists
            var existingStoreByName = await _storeRepository.FirstOrDefaultAsync(
                s => s.Name == input.StoreName && !s.IsDeleted);

            if (existingStoreByName != null)
            {
                throw new UserFriendlyException($"A store with the name '{input.StoreName}' already exists.");
            }

            // 🔎 Check if the email already exists in any approved store
            var existingStoreByEmail = await _storeRepository.FirstOrDefaultAsync(
                s => s.Owner.EmailAddress == input.OwnerEmail && !s.IsDeleted);

            if (existingStoreByEmail != null)
            {
                throw new UserFriendlyException($"A store with the email '{input.OwnerEmail}' already exists.");
            }

            // ✅ Proceed with saving the store request
            var storeRequest = ObjectMapper.Map<StoreRequest>(input);
            storeRequest.StorerequestStatus = StoreRequestStatus.Pending;
            storeRequest.StoreOwnerId = null;

            var createdRequest = await Repository.InsertAsync(storeRequest);

            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<GetStoreRequestDto>(createdRequest);
        }

        public async Task<PagedResultDto<GetStoreRequestSpDto>> GetAllStoreRequests(PagedStoreRequestResultRequestSpDto input)
        {
            var data = await _storeRequestRepository.GetAllStoreRequestsSP(input);
            return data;
        }

        public override Task DeleteAsync(EntityDto<Guid> input)
        {
            return base.DeleteAsync(input);
        }

        public override Task<PagedResultDto<GetStoreRequestDto>> GetAllAsync(PagedStoreRequestResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetStoreRequestDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetStoreRequestDto> UpdateAsync(UpdateStoreRequestDto input)
        {
            return base.UpdateAsync(input);
        }

        public async Task<List<GetPendingStoreRequestsSpDto>> GetPendingStoreRequests(PagedPendingStoreRequestsResultRequestSpDto input)
        {
            var data = await _storeRequestRepository.GetPendingStoreRequestsSp(input);
            return data;
        }

    }
}
