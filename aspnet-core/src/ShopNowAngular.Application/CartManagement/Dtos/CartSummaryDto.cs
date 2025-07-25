using ShopNowAngular.CartItemsManagement.Dtos;
using System;
using System.Collections.Generic;

namespace ShopNowAngular.CartManagement.Dtos
{
    public class CartSummaryDto
    {
        public Guid CartId { get; set; }                  // Unique identifier for the cart
        public long CustomerId { get; set; }             // ID of the customer who owns the cart
        public Guid StoreId { get; set; }                // Store associated with the cart
        public double TotalAmount { get; set; }          // Total price of items in the cart
        public int TotalItems { get; set; }              // Number of unique products in the cart
        public List<CartItemDto> CartItems { get; set; } // List of items in the cart
    }
}
