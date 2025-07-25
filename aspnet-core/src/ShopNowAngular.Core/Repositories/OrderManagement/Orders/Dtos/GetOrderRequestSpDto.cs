using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.OrderManagement.Orders.Dtos
{
    public class GetOrderRequestSpDto
    {
        public double TotalAmount { get; set; }
        public string StoreName { get; set; }
        public string Username {  get; set; }
    }
}
