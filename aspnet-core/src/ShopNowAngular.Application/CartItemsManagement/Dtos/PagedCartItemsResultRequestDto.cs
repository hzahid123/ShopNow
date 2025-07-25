using Abp.Runtime.Validation;
using ShopNowAngular.Comman.Dto;

namespace ShopNowAngular.CartItemsManagement.Dtos
{
    public class PagedCartItemsResultRequestDto : PagedAndSortedInputDto, IShouldNormalize
    {
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

