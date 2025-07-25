using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using ShopNowAngular.Repositories.StoreManagement.StoreFollower;
using ShopNowAngular.Repositories.Wishlist;
using ShopNowAngular.StoreFollowers.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopNowAngular.StoreFollowers
{
    public class StoreFollowerAppservice : AsyncCrudAppService<StoreFollower, GetStoreFollowerDto, Guid, PagedStoreFollowerResultRequestDto, CreateStoreFollowerDto, UpdateStoreFollowerDto>, IStoreFollowerAppService
    {
        private readonly IStoreFollowersRepository _StoreFollowersRepository;
        public StoreFollowerAppservice(IRepository<StoreFollower, Guid> repository, IStoreFollowersRepository StoreFollowersRepository) : base(repository)
        {
            _StoreFollowersRepository = StoreFollowersRepository;
        }
        public async Task FollowStoreAsync(CreateStoreFollowerDto input)
        {
            var userId = AbpSession.GetUserId();

            var exists = await Repository.FirstOrDefaultAsync(x =>
                x.CustomerId == userId && x.StoreId == input.StoreId);

            if (exists != null)
                throw new UserFriendlyException("You are already following this store.");

            await Repository.InsertAsync(new StoreFollower
            {
                CustomerId = userId,
                StoreId = input.StoreId
            });
        }

        public async Task UnfollowStoreAsync(UnfollowStoreInput input)
        {
            var userId = AbpSession.GetUserId();

            var follower = await Repository.FirstOrDefaultAsync(x =>
                x.CustomerId == userId && x.StoreId == input.StoreId);

            if (follower != null)
                await Repository.DeleteAsync(follower.Id);
        }

        public async Task<List<Guid>> GetFollowedStoreIdsAsync()
        {
            var userId = AbpSession.GetUserId();
            return await Repository.GetAll()
                .Where(x => x.CustomerId == userId)
                .Select(x => x.StoreId)
                .ToListAsync();
        }
    }
}
