using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.OrderManagement.Orders.Dtos
{
    public class GetMonthlySalesByStoreSpDto
    {
        public int MonthNumber { get; set; }       // Matches "MONTH(O.CreationTime)"
        public string MonthName { get; set; }      // Matches "DATENAME(MONTH, O.CreationTime)"
        public double TotalSales { get; set; }    // Matches SUM(...)
    }
}
