using Abp.Application.Services.Dto;
using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.orders;
using ShopNowAngular.Repositories.ProductManagement.SubCategories.Dtos;
using ShopNowAngular.Repositories.ProductManagement.SubSubCategories.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.ProductManagement.SubSubCategories
{
    internal class SubSubCategoryRepository : ShopNowAngularRepositoryBase<Order, Guid>
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public SubSubCategoryRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }

        public async Task<PagedResultDto<GetSubSubCategoriesRequestSpDto>> GetAllSubSubCategories(PagedSubSubCategoriesRequestResultRequestSpDto input)
           => await ExecuteSearchStoreProcedure<PagedSubSubCategoriesRequestResultRequestSpDto, GetSubSubCategoriesRequestSpDto>(input, "[product].[GetAllSubSubCategories]");


    }
}
