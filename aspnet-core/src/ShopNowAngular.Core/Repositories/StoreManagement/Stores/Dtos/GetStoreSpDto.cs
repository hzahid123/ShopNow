using System;

namespace ShopNowAngular.Repositories.StoreManagement.Stores.Dtos
{
    public class GetStoreSpDto
    {
        public Guid Id { get; set; }

        public string StoreName { get; set; }

        public string OwnerFirstName { get; set; }

        public string OwnerSurname { get; set; }

        public string EmailAddress { get; set; }

    }
}
