﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.OrderManagement.Orders.Dtos
{
    public class GetMonthlySalesAllStoresSpDto
    {
        public int MonthNumber { get; set; }
        public string MonthName { get; set; }
        public double TotalSales { get; set; }
    }

}
