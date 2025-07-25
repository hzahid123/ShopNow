using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.ProductReviews;
using ShopNowAngular.Repositories.ProductManagement.ProductReviews;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.ProductManagement.ProductReviews
{
    public class ProductReviewsRepository : ShopNowAngularRepositoryBase<ProductReview, Guid>, IProductReviewRepository
    

    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public ProductReviewsRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }
    }
}
