using Abp.Runtime.Validation;
using SCMS.PagedSorting.Dto;

namespace ShopNowAngular.Repositories.Users.Dtos
{
    public class PagedUserResultRequestSpDto : PagedAndInputSortedInputDto, IShouldNormalize
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
