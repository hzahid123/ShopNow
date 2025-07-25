using System;

namespace ShopNowAngular.CartManagement.Dtos
{
    public class UpdateCartQuantityDto
    {
        public Guid CartItemId { get; set; } // The ID of the cart item to update
        public double NewQuantity { get; set; } // The new quantity for the cart item
    }
}
