using System;

namespace ShopNowAngular.CartItemsManagement.Dtos
{
    public class CartItemDto
    {
        public Guid CartItemId { get; set; }   // Unique identifier for the cart item
        public Guid ProductId { get; set; }    // ID of the product
        public string ProductName { get; set; } // Name of the product
        public double Quantity { get; set; }   // Number of units added to the cart
        public double Price { get; set; }      // Price of a single unit
        public double TotalPrice => Quantity * Price; // Computed total price of the item
    }
}
