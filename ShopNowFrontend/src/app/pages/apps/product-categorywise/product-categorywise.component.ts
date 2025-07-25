import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { CartService, CartItem } from '../add-to-cart/add-to-cart.service';
import { Subscription, Observable } from 'rxjs';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// Material Icons
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-categorywise',
  standalone: true,
  imports: [
    CommonModule,
    PrimeSharedModule,
    SharedModule,
    CardModule,
    ButtonModule,
    MatIconModule
  ],
  templateUrl: './product-categorywise.component.html',
  styleUrl: './product-categorywise.component.scss',
  providers: [MessageService]
})
export class ProductCategorywiseComponent implements OnInit, OnDestroy {

  // Basic Properties
  categoryId: string = '';
  categorySlug: string = '';
  products: any[] = [];
  isLoading = false;
  loadingError: string | null = null;

  // Cart Properties
  cartItems$: Observable<CartItem[]>;
  addingToCart = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private apiService: ApiService,
    private cartService: CartService
  ) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {
    console.log('=== COMPONENT INITIALIZED ===');

    const paramSubscription = this.route.params.subscribe(params => {
      console.log('Route params:', params);
      
      // Handle both 'id' and 'slug' parameters
      this.categoryId = params['id'] || '';
      this.categorySlug = params['slug'] || '';

      console.log('Category ID:', this.categoryId);
      console.log('Category Slug:', this.categorySlug);

      // Use categoryId if available, otherwise use categorySlug
      const categoryParam = this.categoryId || this.categorySlug;
      
      if (categoryParam) {
        console.log('Loading products for category:', categoryParam);
        this.loadProductsByCategory(categoryParam);
      } else {
        console.warn('No category parameter found in route');
        this.loadingError = 'No category specified';
      }
    });

    this.subscriptions.push(paramSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadProductsByCategory(categoryId: string): void {
    console.log('Loading products for category ID:', categoryId);
    this.isLoading = true;
    this.loadingError = null;

    const productSubscription = this.apiService.getproductbycategory(categoryId).subscribe({
      next: (response: any) => {
        console.log('Raw API response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response || {}));

        // Parse the response to get products array
        let products = [];
        
        // Try different possible response structures
        if (response?.result?.items && Array.isArray(response.result.items)) {
          products = response.result.items;
          console.log('Found products in response.result.items:', products.length);
        } else if (response?.result && Array.isArray(response.result)) {
          products = response.result;
          console.log('Found products in response.result:', products.length);
        } else if (response?.data?.items && Array.isArray(response.data.items)) {
          products = response.data.items;
          console.log('Found products in response.data.items:', products.length);
        } else if (response?.data && Array.isArray(response.data)) {
          products = response.data;
          console.log('Found products in response.data:', products.length);
        } else if (response?.items && Array.isArray(response.items)) {
          products = response.items;
          console.log('Found products in response.items:', products.length);
        } else if (Array.isArray(response)) {
          products = response;
          console.log('Found products in direct response array:', products.length);
        } else {
          console.warn('No products found in response. Response structure:', response);
          products = [];
        }

        this.products = products;
        this.isLoading = false;

        console.log('Final products array:', this.products);
        console.log('Products loaded:', this.products.length);

        if (products.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'No Products',
            detail: 'No products found for this category',
            life: 3000
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Products Loaded',
            detail: `${products.length} products loaded for this category`,
            life: 3000
          });
        }
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.loadingError = 'Failed to load products. Please try again.';
        this.isLoading = false;
        this.products = [];

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products. Please try again.',
          life: 5000
        });
      }
    });

    this.subscriptions.push(productSubscription);
  }

  // Navigate to product detail page
  onProductClick(product: any): void {
    this.router.navigate(['/apps/product-detail', product.id]);
  }

  // ============= CART OPERATIONS =============

  addToCart(product: any, quantity: number = 1): void {
    if (!this.validateCartOperation(product, quantity)) return;

    this.addingToCart = true;

    const addToCartSubscription = this.cartService.addToCart(product, quantity).subscribe({
      next: (success) => {
        this.addingToCart = false;

        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Added to Cart',
            detail: `${product.title || product.name} has been added to your cart`,
            life: 3000
          });
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
        this.addingToCart = false;
        console.error('Error adding to cart:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while adding item to cart',
          life: 3000
        });
      }
    });

    this.subscriptions.push(addToCartSubscription);
  }

  increaseQuantity(product: any): void {
    this.updateCartQuantity(product, 1);
  }

  decreaseQuantity(product: any): void {
    this.updateCartQuantity(product, -1);
  }

  private updateCartQuantity(product: any, change: number): void {
    const cartItem = this.cartService.getCartItemById(product.id?.toString() || product.productId);

    if (cartItem) {
      const newQuantity = cartItem.quantity + change;

      if (change > 0 && newQuantity > (product.maxQuantity || product.stockQuantity || 10)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Quantity Limit',
          detail: 'Maximum quantity reached for this product',
          life: 3000
        });
        return;
      }

      if (newQuantity <= 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Invalid Quantity',
          detail: 'Quantity must be at least 1',
          life: 3000
        });
        return;
      }

      this.addingToCart = true;

      const updateSubscription = this.cartService.updateQuantity(cartItem.cartItemId!, newQuantity).subscribe({
        next: (success) => {
          this.addingToCart = false;
          if (!success) {
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: 'Could not update item quantity',
              life: 3000
            });
          }
        },
        error: (error) => {
          this.addingToCart = false;
          console.error('Error updating quantity:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while updating quantity',
            life: 3000
          });
        }
      });

      this.subscriptions.push(updateSubscription);
    }
  }

  private validateCartOperation(product: any, quantity: number): boolean {
    if (!product || !product.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Product',
        detail: 'Cannot add invalid product to cart',
        life: 3000
      });
      return false;
    }

    if (quantity < 1 || quantity > (product.maxQuantity || product.stockQuantity || 10)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Quantity',
        detail: `Quantity must be between 1 and ${product.maxQuantity || product.stockQuantity || 10}`,
        life: 3000
      });
      return false;
    }

    if (!this.isProductAvailable(product)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Out of Stock',
        detail: 'This product is currently out of stock',
        life: 3000
      });
      return false;
    }

    return true;
  }

  // Check if product is in cart
  isProductInCart(productId: number | string): boolean {
    return this.cartService.isInCart(productId?.toString());
  }

  // Get product quantity in cart
  getProductQuantityInCart(productId: number | string): number {
    return this.cartService.getItemQuantityInCart(productId?.toString());
  }

  // Check if product is available
  isProductAvailable(product: any): boolean {
    if (product.inStock !== undefined) {
      return product.inStock;
    }

    if (product.available !== undefined) {
      return product.available;
    }

    if (product.stockQuantity !== undefined) {
      return product.stockQuantity > 0;
    }

    if (product.stock !== undefined) {
      return product.stock > 0;
    }

    if (product.quantity !== undefined) {
      return product.quantity > 0;
    }

    if (product.isAvailable !== undefined) {
      return product.isAvailable;
    }

    return true;
  }

  // Get product image with fallback
  getProductImage(product: any): string {
    const imageProperties = ['imgSrc', 'image', 'itemImageSrc', 'thumbnailImageSrc', 'productImage', 'imageUrl'];

    for (const prop of imageProperties) {
      if (product[prop] && typeof product[prop] === 'string') {
        return product[prop];
      }
    }

    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0].itemImageSrc || product.images[0].thumbnailImageSrc || '';
    }

    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
  }

  // Handle image load errors
  onImageError(event: any, product?: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
  }

  // Check if product has discount
  hasDiscount(product: any): boolean {
    const originalPrice = product.originalPrice || product.regularPrice;
    return originalPrice && originalPrice > product.price;
  }

  // Calculate discount percentage
  getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  // Get filled stars array
  getStarArray(rating: number): number[] {
    const filledStars = Math.floor(rating);
    return Array(filledStars).fill(0);
  }

  // Get empty stars array
  getEmptyStarArray(rating: number): number[] {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;
    return Array(emptyStars).fill(0);
  }

  // Format price for display
  formatPrice(price: number): string {
    if (!price) return 'PKR 0';
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Go back to home page
  goBack(): void {
    this.router.navigate(['/']);
  }

  // Retry loading products
  retryLoading(): void {
    if (this.categoryId) {
      this.loadProductsByCategory(this.categoryId);
    }
  }

  // Track function for ngFor performance
  trackByProductId(index: number, product: any): any {
    return product.id || index;
  }
}