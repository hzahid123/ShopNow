using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.Repositories.StoreManagement.StoreFollower;
using ShopNowAngular.Repositories.StoreManagement.StoreRequests;
using ShopNowAngular.StoreFollowers;
using ShopNowAngular.Stores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.StoreManagement.StoreFollowers
{
    public class StoreFollowerRepository : ShopNowAngularRepositoryBase<StoreFollower, Guid>, IStoreFollowersRepository
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public StoreFollowerRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }
    }

}
