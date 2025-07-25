using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.OrderManagement.Orders.Dtos
{
    public class GetOrderCountByStatusSpDto
    {
        public int OrderStatus { get; set; }
        public int TotalOrders { get; set; }
    }
}
