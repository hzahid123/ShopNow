using System;

namespace ShopNowAngular.Repositories.CartsMannagement.Carts.Dtos
{
    public class GetAddItemToCartSpDto
    {
        public Guid CartId { get; set; }
        public long CustomerId { get; set; }
        public Guid ProductId { get; set; }
        public double QuantityAdded { get; set; }
        public double UnitPrice { get; set; }
        public double LineTotal { get; set; }
        public double UpdatedProductStock { get; set; }
    }
}
