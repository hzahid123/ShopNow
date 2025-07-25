using System;

namespace ShopNowAngular.Repositories.CartsMannagement.Carts.Dtos
{
    public class AddItemToCartSpDto
    {
        public long CustomerId { get; set; }
        public Guid ProductId { get; set; }
        public double Quantity { get; set; }
        //public Guid StoreId { get; set; }
    }
}
