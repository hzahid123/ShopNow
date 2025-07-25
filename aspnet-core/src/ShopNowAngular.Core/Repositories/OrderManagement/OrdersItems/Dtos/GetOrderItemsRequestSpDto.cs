using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.OrderManagement.OrdersItems.Dtos
{
    public class GetOrderItemsRequestSpDto
    {
        public double Quantity { get; set; }
        public string ProductName { get; set; }
        public double TotalAmount { get; set; }
        public string StoreName { get; set; }
    }
}
