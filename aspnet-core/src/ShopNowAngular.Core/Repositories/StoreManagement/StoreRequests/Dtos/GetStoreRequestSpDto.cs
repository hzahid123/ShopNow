using ShopNowAngular.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.StoreManagement.StoreRequests.Dtos
{
    public class GetStoreRequestSpDto
    {
        public string StoreName {  get; set; }
        public string OwnerName { get; set; } 
        public string OwnerSurname { get; set; }
        public string OwnerEmail { get; set; }
        public StoreRequestStatus StorerequestStatus { get; set; }


    }
}
