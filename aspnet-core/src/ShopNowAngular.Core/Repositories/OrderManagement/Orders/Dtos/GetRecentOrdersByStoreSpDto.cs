using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.OrderManagement.Orders.Dtos
{
    public class GetRecentOrdersByStoreSpDto
    {
        public string ProductName { get; set; }
        public string Category { get; set; }
        public double Price { get; set; }
        public int Status { get; set; }
    }
}
