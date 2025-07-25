using Abp.Application.Services.Dto;
using ShopNowAngular.Repositories.StoreManagement.StoreRequests.Dtos;
using ShopNowAngular.Repositories.Users.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.Users
{
    public interface IUserRepository
    {
        Task<PagedResultDto<GetUserSpDto>> GetAllUsersSP(PagedUserResultRequestSpDto input);

        Task<List<GetTotalUsersSpDto>> GetTotalUsersSp(PagedTotalUsersResultRequestSpDto input);
    }
}
