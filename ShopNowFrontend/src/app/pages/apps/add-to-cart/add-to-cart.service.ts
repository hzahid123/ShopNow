// add-to-cart.service.ts - Updated to use database APIs

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from '../../../services/api.service'; // Adjust path as needed

export interface CartItem {
  cartItemId?: string;
  id?: number;
  productId: string;
  name: string;
  productName?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  totalPrice?: number;
  image: string;
  brand: string;
  category?: string;
  model?: string;
  inStock?: boolean;
  maxQuantity?: number;
  isWishlisted?: boolean;
  addedAt?: Date;
  addedDate?: Date;
  size?: string;
  color?: string;
  rating?: number;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
  totalItems?: number;
  totalAmount?: number;
  cartItems?: CartItem[];
  customerId?: number;
  cartId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private cartSummarySubject = new BehaviorSubject<CartSummary>({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    itemCount: 0
  });
  public cartSummary$ = this.cartSummarySubject.asObservable();

  private customerId: number = 4; // This should come from authentication service
  private cartId: string = '';

  constructor(private apiService: ApiService) {
    this.loadCartFromDatabase();
  }

  setCustomerId(customerId: number): void {
    this.customerId = customerId;
    this.loadCartFromDatabase();
  }

  private loadCartFromDatabase(): void {
    if (!this.customerId) {
      console.warn('No customer ID available');
      return;
    }

    this.apiService.getCartSummary(this.customerId).subscribe({
      next: (response) => {
        console.log('Cart loaded from database:', response);
        this.updateCartFromApiResponse(response);
      },
      error: (error) => {
        console.error('Error loading cart from database:', error);
        // Fallback to empty cart
        this.cartItemsSubject.next([]);
        this.updateCartSummary();
      }
    });
  }

  private updateCartFromApiResponse(apiResponse: any): void {
    const data = apiResponse.result; // ✅ Extract the real payload

    const cartItems: CartItem[] = (data.cartItems || []).map((item: any) => ({
      cartItemId: item.cartItemId,
      productId: item.productId,
      name: '', // Optional: Add if product name is needed
      price: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.lineTotal,
      image: '', // Optional
      brand: '',
      inStock: true
    }));

    this.cartItemsSubject.next(cartItems);

    const summary: CartSummary = {
      subtotal: data.totalAmount || 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: data.totalAmount || 0,
      itemCount: data.totalItems || 0,  // ✅ use totalItems
      totalItems: data.totalItems,
      totalAmount: data.totalAmount,
      cartItems: cartItems,
      customerId: data.customerId,
      cartId: data.cartId
    };

    this.cartId = data.cartId || '';
    this.cartSummarySubject.next(summary);
  }

  addToCart(product: any, quantity: number = 1): Observable<boolean> {
    if (!this.customerId) {
      console.error('No customer ID available');
      return of(false);
    }

    const addToCartRequest = {
      customerId: this.customerId,
      productId: product.id || product.productId,
      quantity: quantity
    };

    return this.apiService.addItemToCart(addToCartRequest).pipe(
      tap((response) => {
        console.log('Item added to cart:', response);
        // Reload cart to get updated data
        this.loadCartFromDatabase();
      }),
      catchError((error) => {
        console.error('Error adding to cart:', error);
        return of(false);
      }),
      tap(() => true)
    );
  }

  removeFromCart(cartItemId: string): Observable<boolean> {
    return this.apiService.removeItemFromCart(cartItemId).pipe(
      tap((response) => {
        console.log('Item removed from cart:', response);
        // Reload cart to get updated data
        this.loadCartFromDatabase();
      }),
      catchError((error) => {
        console.error('Error removing from cart:', error);
        return of(false);
      }),
      tap(() => true)
    );
  }

  updateQuantity(cartItemId: string, quantity: number): Observable<boolean> {
    if (quantity < 1) {
      return this.removeFromCart(cartItemId);
    }

    const updateRequest = {
      cartItemId: cartItemId,
      newQuantity: quantity
    };

    return this.apiService.updateCartItemQuantity(updateRequest).pipe(
      tap((response) => {
        console.log('Cart item quantity updated:', response);
        // Reload cart to get updated data
        this.loadCartFromDatabase();
      }),
      catchError((error) => {
        console.error('Error updating quantity:', error);
        return of(false);
      }),
      tap(() => true)
    );
  }

  clearCart(cartId: string): Observable<boolean> {
    if (!this.cartId) {
      console.warn('No cart ID available');
      return of(false);
    }

    return this.apiService.clearCart(this.cartId).pipe(
      tap((response) => {
        console.log('Cart cleared:', response);
        // Reset local cart data
        this.cartItemsSubject.next([]);
        this.cartSummarySubject.next({
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
          itemCount: 0
        });
      }),
      catchError((error) => {
        console.error('Error clearing cart:', error);
        return of(false);
      }),
      tap(() => true)
    );
  }

  // Helper method to refresh cart data
  refreshCart(): void {
    this.loadCartFromDatabase();
  }

  private getProductImage(product: any): string {
    const imageProperties = [
      'image',
      'imgSrc',
      'itemImageSrc',
      'thumbnailImageSrc',
      'productImage'
    ];

    for (const prop of imageProperties) {
      if (product[prop] && typeof product[prop] === 'string') {
        return product[prop];
      }
    }

    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0].itemImageSrc || product.images[0].thumbnailImageSrc || '';
    }

    return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop';
  }

  // Legacy methods for backward compatibility
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartSummary(): CartSummary {
    return this.cartSummarySubject.value;
  }

  private updateCartSummary(): void {
    const items = this.cartItemsSubject.value;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const tax = subtotal * 0.08;
    const shipping = subtotal > 5000 ? 0 : 200;
    const total = subtotal + tax + shipping;

    const summary: CartSummary = {
      subtotal,
      tax,
      shipping,
      discount: 0,
      total,
      itemCount,
      customerId: this.customerId,
      cartId: this.cartId
    };

    this.cartSummarySubject.next(summary);
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  isInCart(productId: string): boolean {
    return this.cartItemsSubject.value.some(item => item.productId === productId || item.id?.toString() === productId);
  }

  getCartItemById(productId: string): CartItem | undefined {
    return this.cartItemsSubject.value.find(item => item.productId === productId || item.id?.toString() === productId);
  }

  getItemQuantityInCart(productId: string): number {
    const item = this.getCartItemById(productId);
    return item ? item.quantity : 0;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  getCartAnalytics(): any {
    const items = this.cartItemsSubject.value;
    const summary = this.cartSummarySubject.value;

    const categoryCounts = items.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + item.quantity;
      return acc;
    }, {} as { [key: string]: number });

    const brandCounts = items.reduce((acc, item) => {
      const brand = item.brand || 'Unknown';
      acc[brand] = (acc[brand] || 0) + item.quantity;
      return acc;
    }, {} as { [key: string]: number });

    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const averageItemPrice = totalItems > 0 ? totalValue / totalItems : 0;

    return {
      totalItems: totalItems,
      totalValue: totalValue,
      averageItemPrice: averageItemPrice,
      uniqueProducts: items.length,
      categoryCounts: categoryCounts,
      brandCounts: brandCounts,
      cartSummary: summary,
      mostExpensiveItem: items.length > 0 ? Math.max(...items.map(item => item.price)) : 0,
      leastExpensiveItem: items.length > 0 ? Math.min(...items.map(item => item.price)) : 0
    };
  }
}