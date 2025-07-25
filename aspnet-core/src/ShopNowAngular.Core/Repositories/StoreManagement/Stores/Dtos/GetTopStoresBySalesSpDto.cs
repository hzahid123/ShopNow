using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.StoreManagement.Stores.Dtos
{
    public class GetTopStoresBySalesSpDto
    {
        public string StoreName { get; set; }
        public double TotalSales { get; set; }
    }
}
