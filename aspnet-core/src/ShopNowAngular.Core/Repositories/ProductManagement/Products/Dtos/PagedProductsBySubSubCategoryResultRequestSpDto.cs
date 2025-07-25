using Abp.Application.Services.Dto;
using Abp.Runtime.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.ProductManagement.Products.Dtos
{
    public class PagedProductsBySubSubCategoryResultRequestSpDto : PagedAndSortedResultRequestDto , IShouldNormalize
    {
        public Guid SubSubCategoryId { get; set; }
        public string Keyword { get; set; }

        public  void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
                Sorting = "creationTime desc";

            Keyword = Keyword?.Trim();
        }
    }

}
