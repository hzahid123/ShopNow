﻿using Abp.Runtime.Validation;
using SCMS.PagedSorting.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.ProductManagement.Products.Dtos
{
    public class PagedProductsByCategoryResultRequestSpDto : PagedAndInputSortedInputDto, IShouldNormalize
    {
        public Guid CategoryId { get; set; }
        public string Keyword { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "creationTime desc";
            }
            Keyword = Keyword?.Trim();
        }
    }
}
