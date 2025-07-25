using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.AspNetCore.Authorization;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.StoreManagement.Stores;
using ShopNowAngular.Repositories.StoreManagement.Stores.Dtos;
using ShopNowAngular.Stores.Dtos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopNowAngular.Stores
{    
    [Authorize]
    public class StoreAppService : AsyncCrudAppService<Store, GetStoreDto, Guid, PagedStoreResultRequestDto, CreateStoreDto, UpdateStoreDto>, IStoreAppService
    {

        private readonly IStoreRepository _storeRepository;
        public StoreAppService(IRepository<Store, Guid> repository, IStoreRepository storeRepository) : base(repository)
        {
            _storeRepository = storeRepository;
        }
        public async Task<PagedResultDto<GetStoreSpDto>> GetAllStores(PagedStoreResultRequestSpDto input)
        {
            var data = await _storeRepository.GetAllStoresSP(input);
            return data;
        }
        public override Task<GetStoreDto> CreateAsync(CreateStoreDto input)
        {
            return base.CreateAsync(input);
        }

        public async Task<GetStoreDto> CreateStore(CreateStoreDto input)
        {
            var store = ObjectMapper.Map<Store>(input);
            store.CreationTime = DateTime.Now;

            await Repository.InsertAsync(store);
            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<GetStoreDto>(store);
        }


        public override Task DeleteAsync(EntityDto<Guid> input)
        {
            return base.DeleteAsync(input);
        }

        public override Task<PagedResultDto<GetStoreDto>> GetAllAsync(PagedStoreResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetStoreDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetStoreDto> UpdateAsync(UpdateStoreDto input)
        {
            return base.UpdateAsync(input);
        }

        protected override Task<Store> GetEntityByIdAsync(Guid id)
        {
            return base.GetEntityByIdAsync(id);
        }

        public async Task<List<GetTotalStoresSpDto>> GetTotalStores(PagedTotalStoresResultRequestSpDto input)
        {
            var data = await _storeRepository.GetTotalStoresSp(input);
            return data;
        }

        public async Task<List<GetTopStoresBySalesSpDto>> GetTopStoresBySales(PagedTopStoresBySalesResultRequestSpDto input)
        {
            
            
                var data = await _storeRepository.GetTopStoresBySalesSp(input);
                return data;
            
        }

        public async Task<List<GetRecentStoresSpDto>> GetRecentStores(PagedRecentStoresResultRequestSpDto input)
        {
              var data = await _storeRepository.GetRecentStoresSp(input);
                return data;
            
            
        }

        public async Task<List<GetTopFollowedStoresSpDto>> GetTopFollowedStores(PagedTopFollowedStoresResultRequestSpDto input)
        {
            var data = await _storeRepository.GetTopFollowedStoresSp(input);
            return data;
        }

        public async Task<List<GetTotalStoreFollowersSpDto>> GetTotalStoreFollowers(PagedTotalStoreFollowersResultRequestSpDto input)
        {
            var data = await _storeRepository.GetTotalStoreFollowersSp(input);
            return data;
        }

    }
}
