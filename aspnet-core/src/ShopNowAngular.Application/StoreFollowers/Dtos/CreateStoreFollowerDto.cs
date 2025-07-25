using Abp.AutoMapper;
using ShopNowAngular.Stores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.StoreFollowers.Dtos
{
    [AutoMapTo(typeof(StoreFollower))]
    public class CreateStoreFollowerDto
    {
        public Guid StoreId { get; set; }
    }
}
