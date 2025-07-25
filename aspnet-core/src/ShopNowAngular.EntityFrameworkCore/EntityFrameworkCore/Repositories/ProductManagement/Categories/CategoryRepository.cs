using Abp.Application.Services.Dto;
using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.orders;
using ShopNowAngular.Repositories.PaymentManagement.Dtos;
using ShopNowAngular.Repositories.ProductManagement.Categories.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.ProductManagement.Categories
{
    public class CategoryRepository : ShopNowAngularRepositoryBase<Order, Guid>
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public CategoryRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }

        public async Task<PagedResultDto<GetCategoriesRequestSpDto>> GetAllCategories(PagedCategoriesRequestResultRequestSpDto input)
           => await ExecuteSearchStoreProcedure<PagedCategoriesRequestResultRequestSpDto, GetCategoriesRequestSpDto>(input, "[product].[GetAllCategories]");


    }
}
