using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SCMS.PagedSorting.Dto
{
    public class PagedAndInputSortedInputDto : PagedInputDto, ISortedResultRequest
    {
        public string Sorting { get; set; }
        public PagedAndInputSortedInputDto()
        {
            MaxResultCount = AppConsts.DefaultPageSize;
        }
    }
}
