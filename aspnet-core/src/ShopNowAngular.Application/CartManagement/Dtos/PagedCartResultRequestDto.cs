using Abp.Runtime.Validation;
using ShopNowAngular.Comman.Dto;

namespace ShopNowAngular.CartManagement.Dtos
{
    public class PagedCartResultRequestDto : PagedAndSortedInputDto, IShouldNormalize
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
