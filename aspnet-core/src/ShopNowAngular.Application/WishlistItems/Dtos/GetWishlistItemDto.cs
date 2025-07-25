using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ShopNowAngular.StoreFollowers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.WishlistItems.Dtos
{
    [AutoMapFrom(typeof(WishlistItem))]
    public class GetWishlistItemDto : EntityDto<Guid>
    {
        public Guid Id { get; set; }
    }
}
