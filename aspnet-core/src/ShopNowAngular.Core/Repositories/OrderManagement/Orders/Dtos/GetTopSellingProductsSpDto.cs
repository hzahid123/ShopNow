using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.OrderManagement.Orders.Dtos
{
    public class GetTopSellingProductsSpDto
    {
        public string Name { get; set; }
        public double TotalSold { get; set; }
    }

}
