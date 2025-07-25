using Abp.Application.Services.Dto;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.StoreManagement.StoreRequests.Dtos;
using ShopNowAngular.Repositories.Users.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.StoreManagement.StoreRequests
{
    public interface IStoreRequestRepository
    {
        Task<PagedResultDto<GetStoreRequestSpDto>> GetAllStoreRequestsSP(PagedStoreRequestResultRequestSpDto input);

        Task<List<GetPendingStoreRequestsSpDto>> GetPendingStoreRequestsSp(PagedPendingStoreRequestsResultRequestSpDto input);

    }
}
