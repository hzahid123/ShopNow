using Abp.Application.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
using ShopNowAngular.Carts;
using ShopNowAngular.CartManagement.Dtos;
using Abp.Domain.Repositories;
using Abp.Application.Services.Dto;
using ShopNowAngular.Products;
using ShopNowAngular.Repositories.CartsMannagement.Carts;
using ShopNowAngular.Repositories.CartsMannagement.Carts.Dtos;
using Abp.Timing;
using Abp.UI;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ShopNowAngular.CartManagement
{
    public class CartAppService : AsyncCrudAppService<Cart, GetCartDto, Guid, PagedCartResultRequestDto, CreateCartDto, UpdateCartDto>, ICartAppService
    {
        private readonly IRepository<CartItem, Guid> _cartItemRepository;
        private readonly IRepository<Product, Guid> _productRepository;
        private readonly ICartRepository _cartRepository;
        public CartAppService(IRepository<Cart, Guid> repository, IRepository<CartItem, Guid> cartItemRepository,
            IRepository<Product, Guid> productRepository, ICartRepository cartRepository) : base(repository)
        {
            _cartItemRepository = cartItemRepository;
            _productRepository = productRepository;
            _cartRepository = cartRepository;
        }

        public override Task<GetCartDto> CreateAsync(CreateCartDto input)
        {
            return base.CreateAsync(input);
        }

        public override Task DeleteAsync(EntityDto<Guid> input)
        {
            return base.DeleteAsync(input);
        }

        public override Task<PagedResultDto<GetCartDto>> GetAllAsync(PagedCartResultRequestDto input)
        {
            return base.GetAllAsync(input);
        }

        public override Task<GetCartDto> GetAsync(EntityDto<Guid> input)
        {
            return base.GetAsync(input);
        }

        public override Task<GetCartDto> UpdateAsync(UpdateCartDto input)
        {
            return base.UpdateAsync(input);
        }
        public async Task<GetAddItemToCartSpDto> AddItemToCart(AddItemToCartSpDto input)
        {
            // 🔒 Validate input
            if (input.Quantity <= 0)
                throw new UserFriendlyException("Quantity must be greater than zero.");

            var product = await _productRepository.FirstOrDefaultAsync(input.ProductId);
            if (product == null)
                throw new UserFriendlyException("Product not found.");

            if (input.Quantity > product.StockQuantity)
                throw new UserFriendlyException($"Only {product.StockQuantity} units available in stock.");

            // ✅ Fetch or create a single cart for this customer
            var cart = await Repository.GetAllIncluding(c => c.CartItems).FirstOrDefaultAsync(c => c.CustomerId == input.CustomerId);


            if (cart == null)
            {
                cart = new Cart
                {
                    Id = Guid.NewGuid(),
                    CustomerId = input.CustomerId,
                    CartItems = new List<CartItem>()
                };

                await Repository.InsertAsync(cart);
                await CurrentUnitOfWork.SaveChangesAsync(); // Ensure CartId is generated
            }

            // 🧾 Add or update the cart item for this product
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == input.ProductId);

            if (cartItem != null)
            {
                cartItem.Quantity += input.Quantity;
            }
            else
            {
                cartItem = new CartItem
                {
                    Id = Guid.NewGuid(),
                    CartId = cart.Id,
                    ProductId = input.ProductId,
                    Quantity = input.Quantity
                };

                await _cartItemRepository.InsertAsync(cartItem);
            }

            // 📉 Update product stock
            product.StockQuantity -= input.Quantity;

            await CurrentUnitOfWork.SaveChangesAsync();

            return new GetAddItemToCartSpDto
            {
                CartId = cart.Id,
                CustomerId = input.CustomerId,
                ProductId = input.ProductId,
                QuantityAdded = input.Quantity,
                UnitPrice = product.Price,
                LineTotal = product.Price * input.Quantity,
                UpdatedProductStock = product.StockQuantity
            };
        }




        public async Task RemoveItemFromCartAsync(Guid cartItemId)
        {
            // Get the cart item
            var cartItem = await _cartItemRepository.FirstOrDefaultAsync(ci => ci.Id == cartItemId);
            if (cartItem == null)
                throw new UserFriendlyException("Cart item not found.");

            // Get the associated product
            var product = await _productRepository.FirstOrDefaultAsync(p => p.Id == cartItem.ProductId);
            if (product == null)
                throw new UserFriendlyException("Associated product not found.");

            // Restore the product's stock
            product.StockQuantity += cartItem.Quantity;

            // Delete the cart item
            await _cartItemRepository.DeleteAsync(cartItem);

            // Persist all changes
            await CurrentUnitOfWork.SaveChangesAsync();
        }


        public async Task ClearCartAsync(Guid cartId)
        {
            var cart = await Repository.GetAsync(cartId);
            if (cart == null)
            {
                throw new UserFriendlyException("Cart not found.");
            }

            // Fetch all items in the cart
            var cartItems = await _cartItemRepository.GetAllListAsync(ci => ci.CartId == cartId);

            foreach (var item in cartItems)
            {
                // Restore stock for each product
                var product = await _productRepository.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                if (product != null)
                {
                    product.StockQuantity += item.Quantity;
                }

                // Remove item from cart
                await _cartItemRepository.DeleteAsync(item);
            }

            await CurrentUnitOfWork.SaveChangesAsync();
        }



        public async Task<CartSummaryDto> GetCartSummaryAsync(long customerId)
        {
            var cart = await Repository
                .GetAllIncluding(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
            {
                return new CartSummaryDto
                {
                    CartId = Guid.Empty,
                    CustomerId = customerId,
                    TotalItems = 0,
                    TotalAmount = 0,
                    CartItems = new List<CartItemDto>()
                };
            }

            var productIds = cart.CartItems.Select(ci => ci.ProductId).ToList();
            var products = await _productRepository.GetAllListAsync(p => productIds.Contains(p.Id));

            double totalAmount = 0;
            var cartItemDtos = new List<CartItemDto>();

            foreach (var ci in cart.CartItems)
            {
                var product = products.FirstOrDefault(p => p.Id == ci.ProductId);
                if (product != null)
                {
                    double lineTotal = ci.Quantity * product.Price;
                    totalAmount += lineTotal;

                    cartItemDtos.Add(new CartItemDto
                    {
                        CartItemId = ci.Id,
                        ProductId = ci.ProductId,
                        Quantity = ci.Quantity,
                        UnitPrice = product.Price,
                        LineTotal = lineTotal
                    });
                }
            }

            return new CartSummaryDto
            {
                CartId = cart.Id,
                CustomerId = customerId,
                TotalItems = cartItemDtos.Count,
                TotalAmount = totalAmount,
                CartItems = cartItemDtos
            };
        }



        private double GetProductPrice(Guid productId)
        {
            var product = _productRepository.FirstOrDefault(productId);
            return product?.Price ?? 0.0;
        }

        public async Task UpdateCartItemQuantityAsync(UpdateCartQuantityDto input)
        {
            // Get the cart item
            var cartItem = await _cartItemRepository.GetAsync(input.CartItemId);
            if (cartItem == null)
                throw new UserFriendlyException("Cart item not found.");

            // Get the product associated with this cart item
            var product = await _productRepository.FirstOrDefaultAsync(p => p.Id == cartItem.ProductId);
            if (product == null)
                throw new UserFriendlyException("Associated product not found.");

            // Calculate the difference between new and old quantity
            var quantityDifference = input.NewQuantity - cartItem.Quantity;

            // Check for stock availability (only when increasing quantity)
            if (quantityDifference > 0 && quantityDifference > product.StockQuantity)
            {
                throw new UserFriendlyException($"Only {product.StockQuantity} units available in stock.");
            }

            // Update stock based on quantity change
            product.StockQuantity -= quantityDifference;

            // Update the cart item quantity
            cartItem.Quantity = input.NewQuantity;

            // Save all changes
            await CurrentUnitOfWork.SaveChangesAsync();
        }


    }
}
