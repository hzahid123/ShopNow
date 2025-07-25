using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.ProductReviews;
using ShopNowAngular.Repositories.ProductManagement.ProductReviews;
using ShopNowAngular.Repositories.Wishlist;
using ShopNowAngular.WishlistItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.Wishlist
{
    public class WishlistItemRepository : ShopNowAngularRepositoryBase<WishlistItem, Guid>, IWishlistItemRepository
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public WishlistItemRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }
    }
}
