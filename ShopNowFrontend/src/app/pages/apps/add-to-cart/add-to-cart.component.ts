// add-to-cart.component.ts - Fixed version with proper data mapping

import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { ChipModule } from 'primeng/chip';

// Angular Material Imports
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageService } from 'primeng/api';
import { CartService, CartItem, CartSummary } from './add-to-cart.service';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeSharedModule,
    ChipModule,
  ],
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
  providers: [PrimeSharedModule, CartService, MessageService, ConfirmationService]
})
export class AddToCartComponent implements OnInit, OnDestroy {
  Math = Math;
  cartItems: CartItem[] = [];
  cartSummary: CartSummary = {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    itemCount: 0
  };

  validationErrors: string[] = [];
  recommendedProducts: any[] = [];
  couponForm: FormGroup;
  appliedCoupon: string | null = null;
  isCartEmpty: boolean = true;
  isLoading: boolean = false;
  dataLoaded: boolean = false;
  addingToCart: boolean = false;
  
  // Database-specific properties
  customerId: number = 4;
  cartId: string = '';
  currentCartSummary: any = null;

  private destroy$ = new Subject<void>();

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initializeCouponForm();
  }

  ngOnInit(): void {
    console.log('Component initializing...');
    this.isLoading = true;
    
    // Set customer ID in service
    this.cartService.setCustomerId(this.customerId);
    
    // Load data directly from API first
    this.loadCartDataDirectly();
  }

  // NEW: Load cart data directly from API and map to component properties
  private loadCartDataDirectly(): void {
    console.log('Loading cart data directly from API...');
    
    this.apiService.getCartSummary(this.customerId).subscribe({
      next: (apiResponse) => {
        console.log('API Response received:', apiResponse);
        
        if (apiResponse && apiResponse.result) {
          this.processApiResponse(apiResponse.result);
        } else {
          console.warn('No result in API response');
          this.handleEmptyCart();
        }
        
        this.isLoading = false;
        this.dataLoaded = true;
      },
      error: (error) => {
        console.error('Error loading cart data:', error);
        this.handleCartLoadError(error);
        this.isLoading = false;
        this.dataLoaded = true;
      }
    });

    // Also load recommendations
    this.loadRecommendations();
  }

  // NEW: Process the API response and map to component properties
  private processApiResponse(result: any): void {
    console.log('Processing API result:', result);
    
    // Set cart ID and basic info
    this.cartId = result.cartId || '';
    this.currentCartSummary = result;
    
    // Map cart items from API response
    if (result.cartItems && result.cartItems.length > 0) {
      this.cartItems = result.cartItems.map((apiItem: any) => {
        const mappedItem: CartItem = {
          id: apiItem.productId || apiItem.cartItemId,
          cartItemId: apiItem.cartItemId,
          productId: apiItem.productId,
          name: this.getProductName(apiItem.productId), // You'll need to implement this
          price: apiItem.unitPrice || 0,
          originalPrice: apiItem.unitPrice ? apiItem.unitPrice * 1.2 : 0, // Assuming 20% discount
          quantity: apiItem.quantity || 1,
          maxQuantity: 10,
          image: this.getProductImage(apiItem.productId), // You'll need to implement this
          brand: this.getProductBrand(apiItem.productId), // You'll need to implement this
          model: '',
          inStock: true,
          isWishlisted: false,
          addedAt: new Date()
        };
        return mappedItem;
      });
      
      this.isCartEmpty = false;
    } else {
      this.cartItems = [];
      this.isCartEmpty = true;
    }
    
    // Calculate cart summary
    this.calculateCartSummary(result);
    
    // Update cart service if needed
    this.updateCartService();
    
    console.log('Processed cart items:', this.cartItems);
    console.log('Processed cart summary:', this.cartSummary);
  }

  // NEW: Calculate cart summary from API data
  private calculateCartSummary(result: any): void {
    const subtotal = result.totalAmount || 0;
    const itemCount = result.totalItems || 0;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over 5000
    const discount = this.appliedCoupon ? subtotal * 0.1 : 0; // 10% discount if coupon applied
    const total = subtotal + tax + shipping - discount;
    
    this.cartSummary = {
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      discount: discount,
      total: total,
      itemCount: itemCount
    };
  }

  // NEW: Update cart service with current data
  private updateCartService(): void {
    // If your cart service needs to be updated, do it here
    // This depends on your CartService implementation
  }

  // PLACEHOLDER: Get product name by ID - replace with actual implementation
  private getProductName(productId: string): string {
    // This should fetch from your product service or API
    // For now, return a placeholder
    const productNames: { [key: string]: string } = {
      '08dcb546-114d-453b-75bf-08ddb6e62147': 'Product 1',
      '9a1d2449-92b3-43fb-75c0-08ddb6e62147': 'Product 2'
    };
    return productNames[productId] || `Product ${productId.substring(0, 8)}`;
  }

  // PLACEHOLDER: Get product image by ID - replace with actual implementation
  private getProductImage(productId: string): string {
    // This should fetch from your product service or API
    // For now, return a placeholder
    const images = [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  // PLACEHOLDER: Get product brand by ID - replace with actual implementation
  private getProductBrand(productId: string): string {
    // This should fetch from your product service or API
    const brands = ['TechPro', 'ElectroMax', 'GadgetPlus', 'DigitalWorld'];
    return brands[Math.floor(Math.random() * brands.length)];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCouponForm(): void {
    this.couponForm = this.formBuilder.group({
      couponCode: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // UPDATED: Simplified loadCartSummary for fallback
  loadCartSummary(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.dataLoaded) {
        resolve();
        return;
      }
      
      this.loadCartDataDirectly();
      resolve();
    });
  }

  private handleEmptyCart(): void {
    this.cartItems = [];
    this.cartSummary = {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      itemCount: 0
    };
    this.isCartEmpty = true;
    console.log('Cart is empty');
  }

  private handleCartLoadError(error: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error Loading Cart',
      detail: 'Failed to load cart data. Please refresh the page.',
      life: 5000
    });
    
    this.handleEmptyCart();
  }

  private loadRecommendations(): Promise<void> {
    return new Promise((resolve) => {
      // Load recommended products
      this.recommendedProducts = [
        {
          id: '2001',
          name: 'Wireless Headphones Pro',
          price: 15000,
          originalPrice: 18000,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          brand: 'AudioTech',
          rating: 4.5,
          isWishlisted: false
        },
        {
          id: '2002',
          name: 'Smart Watch Ultra',
          price: 25000,
          originalPrice: 30000,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
          brand: 'TechTime',
          rating: 4.2,
          isWishlisted: false
        },
        {
          id: '2003',
          name: 'Bluetooth Speaker Pro',
          price: 8000,
          originalPrice: 10000,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
          brand: 'SoundMax',
          rating: 4.0,
          isWishlisted: false
        },
        {
          id: '2004',
          name: 'Smartphone Pro Max',
          price: 45000,
          originalPrice: 50000,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
          brand: 'TechPro',
          rating: 4.3,
          isWishlisted: false
        }
      ];
      resolve();
    });
  }

  // Debug method to check data state
  debugCartData(): void {
    console.log('=== CART DEBUG INFO ===');
    console.log('dataLoaded:', this.dataLoaded);
    console.log('isLoading:', this.isLoading);
    console.log('isCartEmpty:', this.isCartEmpty);
    console.log('cartItems:', this.cartItems);
    console.log('cartSummary:', this.cartSummary);
    console.log('cartId:', this.cartId);
    console.log('customerId:', this.customerId);
    console.log('currentCartSummary:', this.currentCartSummary);
    console.log('======================');
  }

  // Force refresh method
  forceRefresh(): void {
    console.log('Force refreshing cart...');
    this.isLoading = true;
    this.dataLoaded = false;
    this.loadCartDataDirectly();
  }

  // Cart Management Methods
  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }

    if (newQuantity > (item.maxQuantity || 10)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Quantity',
        detail: `Maximum ${item.maxQuantity || 10} items allowed`,
        life: 3000
      });
      return;
    }

    if (!item.cartItemId) {
      console.error('Cart item ID missing');
      return;
    }

    this.isLoading = true;
    
    // Update locally first for immediate UI feedback
    const oldQuantity = item.quantity;
    item.quantity = newQuantity;
    this.calculateCartSummary(this.currentCartSummary);
    
    // Then update via service
    this.cartService.updateQuantity(item.cartItemId, newQuantity).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: `Quantity updated to ${newQuantity}`,
            life: 2000
          });
        } else {
          // Revert on failure
          item.quantity = oldQuantity;
          this.calculateCartSummary(this.currentCartSummary);
        }
      },
      error: (error) => {
        this.isLoading = false;
        // Revert on error
        item.quantity = oldQuantity;
        this.calculateCartSummary(this.currentCartSummary);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update quantity'
        });
      }
    });
  }

  increaseCartItemQuantity(cartItem: CartItem): void {
    const newQuantity = cartItem.quantity + 1;
    this.updateQuantity(cartItem, newQuantity);
  }

  decreaseCartItemQuantity(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      const newQuantity = cartItem.quantity - 1;
      this.updateQuantity(cartItem, newQuantity);
    } else {
      this.removeItem(cartItem);
    }
  }

  removeItem(item: CartItem): void {
    if (!item.cartItemId) {
      console.error('Cart item ID missing');
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to remove "${item.name}" from your cart?`,
      header: 'Remove Item',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.isLoading = true;
        
        // Remove from local array first
        const itemIndex = this.cartItems.findIndex(cartItem => cartItem.cartItemId === item.cartItemId);
        if (itemIndex > -1) {
          this.cartItems.splice(itemIndex, 1);
          this.isCartEmpty = this.cartItems.length === 0;
          this.calculateCartSummary(this.currentCartSummary);
        }
        
        this.cartService.removeFromCart(item.cartItemId!).subscribe({
          next: (success) => {
            this.isLoading = false;
            if (success) {
              this.messageService.add({
                severity: 'success',
                summary: 'Removed',
                detail: `${item.name} removed from cart`,
                life: 3000
              });
            }
          },
          error: (error) => {
            this.isLoading = false;
            // Reload data on error
            this.forceRefresh();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to remove item from cart'
            });
          }
        });
      }
    });
  }

/** 1️⃣  Ask the user first **/
confirmClearEntireCart(): void {
  // Nothing to confirm if cart is already empty
  if (!this.cartItems?.length) { return; }

  this.confirmationService.confirm({
    message : `Are you sure you want to remove all ${this.cartItems.length} ` +
              `item${this.cartItems.length === 1 ? '' : 's'} from your cart?`,
    header  : 'Clear Cart',
    icon    : 'pi pi-exclamation-triangle',
    acceptButtonStyleClass: 'p-button-danger',
    accept  : () => this.doClearEntireCart(),      // ← only run if they click “Yes”
    reject  : () => {
      this.messageService.add({
        severity: 'info',
        summary : 'Cancelled',
        detail  : 'Your cart was not cleared'
      });
    }
  });
}

/** 2️⃣  Actual clear logic (your original method, slightly refactored) */
private doClearEntireCart(): void {
  // ── Resolve cartId ────────────────────────────────────────s09876
  if (!this.cartId) {
    this.cartId = this.currentCartSummary?.cartId ?? null;
    if (!this.cartId) {
      this.messageService.add({
        severity: 'warn',
        summary : 'Warning',
        detail  : 'No cart found to clear'
      });
      return;
    }
  }

  console.log('Clearing cart:', this.cartId);

  // ── Call API ──────────────────────────────────────────────
  this.apiService.clearCart(this.cartId).subscribe({
    next: (response) => {
      console.log('Cart cleared:', response);

      // Reset local data
      this.cartItems = [];
      this.currentCartSummary = null;

      this.messageService.add({
        severity: 'success',
        summary : 'Cart Cleared',
        detail  : 'All items removed from cart'
      });
    },
    error: (error) => {
      console.error('Error clearing cart:', error);
      this.messageService.add({
        severity: 'error',
        summary : 'Error',
        detail  : 'Failed to clear cart'
      });
    }
  });
}

// Keep all other existing methods unchanged...
  proceedToCheckout(): void {
    if (!this.isCartValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Cannot Proceed',
        detail: 'Please fix the issues in your cart before proceeding',
        life: 5000
      });
      return;
    }

    this.router.navigate(['/apps/checkout'], {
      queryParams: { 
        fromCart: true,
        itemCount: this.cartSummary.itemCount,
        subtotal: this.cartSummary.subtotal,
        tax: this.cartSummary.tax,
        shipping: this.cartSummary.shipping,
        discount: this.cartSummary.discount,
        total: this.cartSummary.total,
        cartId: this.cartId,
        customerId: this.customerId
      }
    });

    this.messageService.add({
      severity: 'info',
      summary: 'Redirecting',
      detail: 'Taking you to checkout...',
      life: 2000
    });
  }

  continueShopping(): void {
    this.router.navigate(['/apps/home']);
  }

  addRecommendedToCart(product: any): void {
    this.isLoading = true;
    this.cartService.addToCart(product, 1).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Added to Cart',
            detail: `${product.name} has been added to your cart`,
            life: 3000
          });
          // Refresh cart data
          this.forceRefresh();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to Add',
            detail: 'Could not add item to cart. Please try again.',
            life: 3000
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add item to cart'
        });
      }
    });
  }

  selectBlog(itemName: string): void {
    console.log('Navigating to product:', itemName);
    this.router.navigate(['/apps/product-details'], {
      queryParams: { product: itemName }
    });
  }

  toggleWishlist(item: CartItem | any): void {
    item.isWishlisted = !item.isWishlisted;

    this.messageService.add({
      severity: 'success',
      summary: item.isWishlisted ? 'Added to Wishlist' : 'Removed from Wishlist',
      detail: `${item.name} ${item.isWishlisted ? 'added to' : 'removed from'} your wishlist`,
      life: 3000
    });
  }

  toggleRecommendedWishlist(item: any): void {
    item.isWishlisted = !item.isWishlisted;

    this.messageService.add({
      severity: 'success',
      summary: item.isWishlisted ? 'Added to Wishlist' : 'Removed from Wishlist',
      detail: `${item.name} ${item.isWishlisted ? 'added to' : 'removed from'} your wishlist`,
      life: 3000
    });
  }

  moveAllToWishlist(): void {
    this.confirmationService.confirm({
      message: 'Move all items to wishlist and clear cart?',
      header: 'Move to Wishlist',
      icon: 'pi pi-heart',
      accept: () => {
        this.cartItems.forEach(item => {
          item.isWishlisted = true;
        });

        this.confirmClearEntireCart();

        this.messageService.add({
          severity: 'success',
          summary: 'Moved to Wishlist',
          detail: 'All items moved to wishlist',
          life: 3000
        });
      }
    });
  }

  saveForLater(item: CartItem): void {
    if (!item.cartItemId) return;

    item.isWishlisted = true;
    this.removeItem(item);

    this.messageService.add({
      severity: 'info',
      summary: 'Saved for Later',
      detail: `${item.name} moved to wishlist`,
      life: 3000
    });
  }

  // Coupon methods
  applyCoupon(): void {
    if (this.couponForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Input',
        detail: 'Please enter a valid coupon code',
        life: 3000
      });
      return;
    }

    const code = this.couponForm.get('couponCode')?.value?.toUpperCase();
    this.applyCouponCode(code);
  }

  applyCouponCode(code: string): void {
    const validCoupons = [
      { code: 'SAVE10', discount: 10, description: '10% off' },
      { code: 'WELCOME20', discount: 20, description: '20% off for new customers' },
      { code: 'STUDENT15', discount: 15, description: '15% student discount' },
      { code: 'SUMMER25', discount: 25, description: '25% summer sale' }
    ];

    const coupon = validCoupons.find(c => c.code === code);

    if (coupon) {
      const discountAmount = (this.cartSummary.subtotal * coupon.discount) / 100;
      
      this.cartSummary.discount = discountAmount;
      this.cartSummary.total = this.cartSummary.subtotal + this.cartSummary.tax + this.cartSummary.shipping - discountAmount;
      this.appliedCoupon = code;

      this.messageService.add({
        severity: 'success',
        summary: 'Coupon Applied',
        detail: `${coupon.description} applied! You saved ${this.formatPrice(discountAmount)}`,
        life: 5000
      });

      this.couponForm.reset();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Coupon',
        detail: 'Please enter a valid coupon code',
        life: 3000
      });
    }
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.cartSummary.discount = 0;
    this.cartSummary.total = this.cartSummary.subtotal + this.cartSummary.tax + this.cartSummary.shipping;

    this.messageService.add({
      severity: 'info',
      summary: 'Coupon Removed',
      detail: 'Coupon has been removed from your cart',
      life: 3000
    });
  }

  // Validation methods
  private validateCart(): void {
    this.validationErrors = [];

    this.cartItems.forEach((item, index) => {
      if (!item.inStock) {
        this.validationErrors.push(`${item.name} is currently out of stock`);
      }

      if (item.quantity > (item.maxQuantity || 10)) {
        this.validationErrors.push(`${item.name} quantity exceeds maximum allowed (${item.maxQuantity || 10})`);
      }

      if (item.price <= 0) {
        this.validationErrors.push(`${item.name} has invalid pricing`);
      }
    });

    if (this.cartSummary.total < 0) {
      this.validationErrors.push('Cart total cannot be negative');
    }
  }

  isCartValid(): boolean {
    this.validateCart();
    return this.validationErrors.length === 0 && !this.isCartEmpty;
  }

  // Utility methods
  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  calculateSavings(item: CartItem): number {
    if (item.originalPrice && item.originalPrice > item.price) {
      return (item.originalPrice - item.price) * item.quantity;
    }
    return 0;
  }

  getTotalSavings(): number {
    return this.cartItems.reduce((total, item) => total + this.calculateSavings(item), 0);
  }

  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  getCartState(): any {
    return {
      items: this.cartItems,
      summary: this.cartSummary,
      appliedCoupon: this.appliedCoupon,
      validationErrors: this.validationErrors,
      isEmpty: this.isCartEmpty,
      isLoading: this.isLoading,
      cartId: this.cartId,
      customerId: this.customerId,
      dataLoaded: this.dataLoaded
    };
  }

  refreshCart(): void {
    this.forceRefresh();
  }


  

isProductInCart(productId: string): boolean {
  return this.cartItems.some(item =>
    String(item.productId) === String(productId) ||
    String(item.id) === String(productId)
  );
}

getProductQuantityInCart(productId: string): number {
  const item = this.cartItems.find(item =>
    String(item.productId) === String(productId) ||
    String(item.id) === String(productId)
  );
  return item ? item.quantity : 0;
}


increaseQuantity(product: any): void {
  const item = this.cartItems.find(i => i.productId === product.id || i.productId === product.productId);
  if (item) {
    this.increaseCartItemQuantity(item);
  }
}

decreaseQuantity(product: any): void {
  const item = this.cartItems.find(i => i.productId === product.id || i.productId === product.productId);
  if (item) {
    this.decreaseCartItemQuantity(item);
  }
}

addToCart(product: any): void {
  this.addRecommendedToCart(product);
}

}