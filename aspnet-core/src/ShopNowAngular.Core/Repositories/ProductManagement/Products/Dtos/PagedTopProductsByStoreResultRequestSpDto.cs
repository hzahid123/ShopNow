using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.ProductManagement.Products.Dtos
{
    public class PagedTopProductsByStoreResultRequestSpDto 
    {
        public Guid StoreId { get; set; }
        public int Limit { get; set; } = 5;

        
    }
}
