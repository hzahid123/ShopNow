using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.StoreManagement.Stores.Dtos
{
    public class GetRecentStoresSpDto
    {
        public string Name { get; set; }
        public long OwnerId { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
