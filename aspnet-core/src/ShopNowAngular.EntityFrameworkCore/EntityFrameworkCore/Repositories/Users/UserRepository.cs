using Abp.Application.Services.Dto;
using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.Users;
using ShopNowAngular.Repositories.Users.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.Users
{
    public class UserRepository : ShopNowAngularRepositoryBase<User, long>, IUserRepository
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public UserRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }
        public async Task<PagedResultDto<GetUserSpDto>> GetAllUsersSP(PagedUserResultRequestSpDto input)
           => await ExecuteSearchStoreProcedure<PagedUserResultRequestSpDto, GetUserSpDto>(input, "[dbo].[GetAllUsers]");

        public async Task<List<GetTotalUsersSpDto>> GetTotalUsersSp(PagedTotalUsersResultRequestSpDto input)
           => await ExecuteSearchStoreProcedureWithOutPagination<PagedTotalUsersResultRequestSpDto, GetTotalUsersSpDto>(input, "[dbo].[GetTotalUsers]");

    }
}
