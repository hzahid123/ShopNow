using System;

namespace ShopNowAngular.CartManagement.Dtos
{
    public class AddToCartDto
    {
        public long CustomerId { get; set; }  // ID of the customer adding the item
        public Guid StoreId { get; set; }     // ID of the store where the product is added from
        public Guid ProductId { get; set; }   // ID of the product being added
        public double Quantity { get; set; }  // Quantity of the product
    }
}
