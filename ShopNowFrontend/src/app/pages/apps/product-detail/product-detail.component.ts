// product-detail.component.ts - Updated with database-driven cart and wishlist methods
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HomeService } from '../home-page/home-page.service';
import { CartService } from '../add-to-cart/add-to-cart.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
// PrimeNG imports - only the ones NOT in PrimeSharedModule
import { MessageService } from 'primeng/api';

// Angular Material imports - only the ones NOT in MaterialModule
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

// Custom modules and services
import { ApiService } from 'src/app/services/api.service';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { SharedModule } from 'src/app//shared/shared.module';

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

interface Product {
  id: number;
  name: string;
  title?: string;
  price: number;
    storeId?: string;

  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  brand: string;
  model?: string;
  description: string;
  features: string[];
  images: Array<{
    itemImageSrc: string;
    thumbnailImageSrc: string;
    alt: string;
  }>;
  category?: string;
  user?: string;
  time?: string;
  wishList?: boolean;
  featuredPost?: boolean;
  maxQuantity?: number;
  imgSrc?: string;
  stockQuantity?: number;
}

interface RelatedProduct {
  id: number;
  productId?: string | number; // Add this if needed
  price: number;
  title?: string;
  name?: string;
  originalPrice: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    // Keep CommonModule, FormsModule, ReactiveFormsModule as they're essential
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Import your custom modules
    PrimeSharedModule,
    SharedModule,
  ],
  providers: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  quantity: number = 1;
  selectedImageIndex: number = 0;
  currentImage: string = '';
  
  // Cart and Wishlist state tracking
  isInWishlist: boolean = false;
  isInCart: boolean = false;
  cartQuantity: number = 0;
  cartItemCount: number = 0;
  addingToCart: boolean = false;
  addingToWishlist: boolean = false;
  
  // Review form state
  showReviewForm: boolean = false;
  reviewForm: FormGroup;
  isSubmittingReview: boolean = false;
  
  private destroy$ = new Subject<void>();
  
  // Product data - Initialize with default values
  product: Product = {
    id: 0,
    name: '',
    title: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    rating: 0,
      // storeId: sessionStorage.getItem('store_id') || '',  
      storeId: '32701114-3f77-42b4-216b-08ddb7d0de62',
    reviewCount: 0,
    inStock: true,
    brand: '',
    model: '',
    description: '',
    features: [],
    images: [],
    maxQuantity: 10,
    stockQuantity: 10
  };

 reviews: Review[] = [];
displayedReviews: Review[] = [];   
page = 1;
pageSize = 4;
  relatedProducts: RelatedProduct[] = [];
  recommendedProducts: RelatedProduct[] = [];

 customerId: number = Number(sessionStorage.getItem('customer_id')|| '');
storeName: string = '';
  cartId: string = ''; // Will be set when cart is created/retrieved
  currentCartSummary: any = null;
  cartItems: any[] = [];
  wishlistItems: any[] = [];

  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private homeService: HomeService,
    private cartService: CartService
  ) {
    // Initialize review form
    this.reviewForm = this.fb.group({

      rating: [0, [Validators.required, Validators.min(1)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
  const productId = params['id'];             
  this.loadProductData(productId);
  this.loadReviews(productId);
});
// In your ngOnInit method, add this line after you have the storeId
this.loadStoreDetails(this.product.storeId || '32701114-3f77-42b4-216b-08ddb7d0de62');

    // Load related products
    this.loadRelatedProducts();

    // Load cart summary to check current cart status
    this.loadCartSummary();

    // Load wishlist to check wishlist status
    this.loadWishlist();

    // Subscribe to cart changes if needed
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartItems => {
        this.updateCartStatus();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.homeService.clearSelectedProduct();
  }

  // WISHLIST API METHODS

  // Load user's wishlist from API
  loadWishlist(): void {
    this.apiService.getWishlist(this.customerId).subscribe({
      next: (wishlistResponse) => {
        console.log('Wishlist loaded:', wishlistResponse);
        this.wishlistItems = wishlistResponse.wishlistItems || wishlistResponse || [];
        
        // Update wishlist status for current product
        this.updateWishlistStatus();
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.wishlistItems = [];
        this.isInWishlist = false;
      }
    });
  }
placeOrder(): void {
  const orderPayload = {
    userId: this.customerId,
    storeId: this.product.storeId || 'b519e9bf-f20e-4a72-b66c-08ddc098f052',  // replace if null
    totalAmount: this.product.price * this.quantity,
    orderStatus: 0, 
    orderItems: [
      {
        orderId: '00000000-0000-0000-0000-000000000000', // ignored by backend if auto-handled
        productId: this.product.id,
        unitPrice: this.product.price,
        quantity: this.quantity
      }
    ]
  };

  this.apiService.createOrder(orderPayload).subscribe({
    next: (response) => {
      this.snackBar.open('Order placed successfully', 'Close', { duration: 3000 });
    },
    error: (err) => {
      console.error('Order placement failed:', err);
      this.snackBar.open('Failed to place order', 'Close', { duration: 3000 });
    }
  });
}
// Add this method to your component
loadStoreDetails(storeId: string): void {
  this.apiService.getStoreById(storeId).subscribe({
    next: (storeResponse) => {
      console.log('Store details:', storeResponse);
      this.storeName = storeResponse.result.name; // ✅ correct path
    },
    error: (error) => {
      console.error('Error loading store details:', error);
      this.storeName = 'Store Not Found';
    }
  });
}

  // Add/Remove product to/from wishlist using API
  onAddToWishlist(product?: any): void {
    const productToToggle = product || this.product;
    
    if (!productToToggle || !productToToggle.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Product',
        detail: 'Cannot modify wishlist for invalid product',
        life: 3000
      });
      return;
    }

    this.addingToWishlist = true;
    const productId = String(productToToggle.id);

    if (this.isInWishlist) {
      // Remove from wishlist
      this.apiService.removeFromWishlist(this.customerId, productId).subscribe({
        next: (response) => {
          this.addingToWishlist = false;
          console.log('Removed from wishlist:', response);
          
          this.isInWishlist = false;
          
          // Update local wishlist items
          this.wishlistItems = this.wishlistItems.filter(item => 
            item.productId !== productId && item.productId !== productToToggle.id
          );
          
          this.messageService.add({
            severity: 'success',
            summary: 'Removed from Wishlist',
            detail: `${productToToggle.name || productToToggle.title} removed from your wishlist`,
            life: 3000
          });
        },
        error: (error) => {
          this.addingToWishlist = false;
          console.error('Error removing from wishlist:', error);
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to remove from wishlist',
            life: 3000
          });
        }
      });
    } else {
      // Add to wishlist
      this.apiService.addToWishlist(this.customerId, productId).subscribe({
        next: (response) => {
          this.addingToWishlist = false;
          console.log('Added to wishlist:', response);
          
          this.isInWishlist = true;
          
          // Add to local wishlist items
          this.wishlistItems.push({
            productId: productId,
            customerId: this.customerId,
            productName: productToToggle.name || productToToggle.title,
            productImage: this.getProductImage(productToToggle),
            price: productToToggle.price
          });
          
          this.messageService.add({
            severity: 'success',
            summary: 'Added to Wishlist',
            detail: `${productToToggle.name || productToToggle.title} added to your wishlist`,
            life: 3000
          });
        },
        error: (error) => {
          this.addingToWishlist = false;
          console.error('Error adding to wishlist:', error);
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Failed to add to wishlist',
            life: 3000
          });
        }
      });
    }
  }

  // Add related product to wishlist
  onAddRelatedToWishlist(item: RelatedProduct): void {
    console.log('Adding related product to wishlist:', item);
    
    this.addingToWishlist = true;
    const productId = String(item.id);

    this.apiService.addToWishlist(this.customerId, productId).subscribe({
      next: (response) => {
        this.addingToWishlist = false;
        console.log('Related product added to wishlist:', response);
        
        // Add to local wishlist items
        this.wishlistItems.push({
          productId: productId,
          customerId: this.customerId,
          productName: item.name,
          productImage: item.image,
          price: item.price
        });
        
        this.messageService.add({
          severity: 'success',
          summary: 'Added to Wishlist',
          detail: `${item.name} added to your wishlist`,
          life: 3000
        });
      },
      error: (error) => {
        this.addingToWishlist = false;
        console.error('Error adding related product to wishlist:', error);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to add to wishlist',
          life: 3000
        });
      }
    });
  }

  // Helper method to check if product is in wishlist
  private isProductInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => 
      item.productId === productId || 
      item.productId === productId.toString()
    );
  }

  // Update wishlist status based on API data
  private updateWishlistStatus(): void {
    this.isInWishlist = this.isProductInWishlist(this.product.id);
  }

  // EXISTING CART METHODS (unchanged)

  // Enhanced Add to cart method using the database-driven API
  onAddToCart(): void {
    console.log('Adding to cart:', this.product);
    
    // Validate product and quantity
    if (!this.product || !this.product.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Product',
        detail: 'Cannot add invalid product to cart',
        life: 3000
      });
      return;
    }
    
    if (this.quantity < 1 || this.quantity > (this.product.maxQuantity || this.product.stockQuantity || 10)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Quantity',
        detail: `Quantity must be between 1 and ${this.product.maxQuantity || this.product.stockQuantity || 10}`,
        life: 3000
      });
      return;
    }
    
    // Check stock availability
    if (!this.product.inStock || (this.product.stockQuantity && this.product.stockQuantity < this.quantity)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Out of Stock',
        detail: 'This product is currently out of stock',
        life: 3000
      });
      return;
    }

    this.addingToCart = true;

    // Prepare cart item data for API
    const cartItemData = {
      customerId: this.customerId,
      productId: String(this.product.id),
      quantity: this.quantity,
      price: this.product.price,
      productName: this.product.name || this.product.title,
      productImage: this.getProductImage(this.product)
    };

    console.log('Adding to cart via API:', cartItemData);

    // Use API service to add to cart
    this.apiService.addItemToCart(cartItemData).subscribe({
      next: (response) => {
        this.addingToCart = false;
        console.log('Cart API response:', response);
        
        if (response && response.success !== false) {
          // Show success message
          this.messageService.add({
            severity: 'success',
            summary: 'Added to Cart',
            detail: `${this.product.title || this.product.name} has been added to your cart`,
            life: 3000
          });

          // Update local cart status
          this.updateCartStatus();
          
          // Reload cart summary to get updated cart data
          this.loadCartSummary();
          
        } else {
          // Show error message
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to Add',
            detail: response?.message || 'Could not add item to cart. Please try again.',
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
          detail: error?.error?.message || 'An error occurred while adding item to cart',
          life: 3000
        });
      }
    });
  }

  // Enhanced Add related product to cart method
  onAddRelatedToCart(item: RelatedProduct): void {
    console.log('Adding related product to cart:', item);
    
    this.addingToCart = true;

    // Prepare cart item data for API
    const cartItemData = {
      customerId: this.customerId,
      productId: String(item.id),
      quantity: 1,
      price: item.price,
      productName: item.name,
      productImage: item.image
    };

    // Use API service to add to cart
    this.apiService.addItemToCart(cartItemData).subscribe({
      next: (response) => {
        this.addingToCart = false;
        
        if (response && response.success !== false) {
          this.messageService.add({
            severity: 'success',
            summary: 'Added to Cart',
            detail: `${item.name} has been added to your cart`,
            life: 3000
          });
          
          // Update cart item count
          this.loadCartSummary();
          
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to Add',
            detail: response?.message || 'Could not add item to cart. Please try again.',
            life: 3000
          });
        }
      },
      error: (error) => {
        this.addingToCart = false;
        console.error('Error adding related product to cart:', error);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'An error occurred while adding to cart',
          life: 3000
        });
      }
    });
  }

  // Increase quantity for product already in cart
  increaseCartQuantity(): void {
    const cartItem = this.getCartItemForProduct(this.product.id);
    
    if (cartItem) {
      const newQuantity = cartItem.quantity + 1;
      
      if (newQuantity > (this.product.maxQuantity || this.product.stockQuantity || 10)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Quantity Limit',
          detail: 'Maximum quantity reached for this product',
          life: 3000
        });
        return;
      }

      this.updateCartItemQuantity(cartItem.cartItemId, newQuantity);
    }
  }

  // Decrease quantity for product in cart
  decreaseCartQuantity(): void {
    const cartItem = this.getCartItemForProduct(this.product.id);
    
    if (cartItem) {
      const newQuantity = cartItem.quantity - 1;
      
      if (newQuantity < 1) {
        // Remove item if quantity becomes 0
        this.removeItemFromCart(cartItem.cartItemId);
      } else {
        this.updateCartItemQuantity(cartItem.cartItemId, newQuantity);
      }
    }
  }

  // Method to update cart item quantity using API
  updateCartItemQuantity(cartItemId: string, newQuantity: number): void {
    const payload = {
      cartItemId: cartItemId,
      newQuantity: newQuantity
    };

    console.log('Updating cart item quantity:', payload);
    this.addingToCart = true;

    this.apiService.updateCartItemQuantity(payload).subscribe({
      next: (response) => {
        this.addingToCart = false;
        console.log('Cart item quantity updated:', response);
        
        // Reload cart summary to get updated data
        this.loadCartSummary();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: `Quantity updated to ${newQuantity}`,
          life: 3000
        });
      },
      error: (error) => {
        this.addingToCart = false;
        console.error('Error updating cart item quantity:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update quantity',
          life: 3000
        });
      }
    });
  }

  // Method to remove item from cart using API
  removeItemFromCart(cartItemId: string): void {
    console.log('Removing cart item:', cartItemId);
    this.addingToCart = true;

    this.apiService.removeItemFromCart(cartItemId).subscribe({
      next: (response) => {
        this.addingToCart = false;
        console.log('Cart item removed:', response);
        
        // Reload cart summary to get updated data
        this.loadCartSummary();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Removed',
          detail: 'Item removed from cart',
          life: 3000
        });
      },
      error: (error) => {
        this.addingToCart = false;
        console.error('Error removing cart item:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove item from cart',
          life: 3000
        });
      }
    });
  }

  // Load cart summary from API
  loadCartSummary(): void {
    this.apiService.getCartSummary(this.customerId).subscribe({
      next: (summary) => {
        console.log('Cart summary loaded:', summary);
        this.currentCartSummary = summary;
        
        // Update local cart items from API response
        this.cartItems = summary.cartItems || [];
        
        // Update cart status for current product
        this.updateCartStatusFromAPI();
        
        // Update cart item count
        this.cartItemCount = summary.totalItems || 0;
        
      },
      error: (error) => {
        console.error('Error loading cart summary:', error);
        // Don't show error message for cart loading as it might not exist yet
        this.currentCartSummary = null;
        this.cartItems = [];
        this.cartItemCount = 0;
      }
    });
  }

  // Clear entire cart using API
  clearEntireCart(): void {
    if (!this.currentCartSummary?.cartId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No cart found to clear',
        life: 3000
      });
      return;
    }

    this.apiService.clearCart(this.currentCartSummary.cartId).subscribe({
      next: (response) => {
        console.log('Cart cleared:', response);
        
        // Reload cart summary
        this.loadCartSummary();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Cart Cleared',
          detail: 'All items removed from cart',
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to clear cart',
          life: 3000
        });
      }
    });
  }

  // Helper method to get cart item for current product
  private getCartItemForProduct(productId: number): any {
    return this.cartItems.find(item => 
      item.productId === productId || 
      item.productId === productId.toString()
    );
  }

  // Update cart status based on API data
  private updateCartStatusFromAPI(): void {
    const cartItem = this.getCartItemForProduct(this.product.id);
    
    this.isInCart = !!cartItem;
    this.cartQuantity = cartItem ? cartItem.quantity : 0;
  }

  // Fallback method to update cart status (for compatibility)
  private updateCartStatus(): void {
    if (this.cartItems && this.cartItems.length > 0) {
      this.updateCartStatusFromAPI();
    } else {
      // Fallback to cart service if API data not available
      this.isInCart = this.cartService.isInCart(this.product.id.toString());
      this.cartQuantity = this.cartService.getItemQuantityInCart(this.product.id.toString());
      this.cartItemCount = this.cartService.getCartItemCount();
    }
  }

  // Get product image with fallback
  private getProductImage(product: any): string {
    const imageProperties = [
      'imgSrc',
      'image',
      'itemImageSrc',
      'thumbnailImageSrc',
      'productImage',
      'imageUrl'
    ];

    for (const prop of imageProperties) {
      if (product[prop] && typeof product[prop] === 'string') {
        return product[prop];
      }
    }

    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0].itemImageSrc || product.images[0].thumbnailImageSrc || '';
    }

    return this.getDefaultProductImage(product);
  }

  // Get default product image
  private getDefaultProductImage(product: any): string {
    const productName = (product.title || product.name || '').toLowerCase();
    
    if (productName.includes('phone')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop';
    } else if (productName.includes('laptop')) {
      return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop';
    } else if (productName.includes('tv')) {
      return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop';
    }
    
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
  }

  // Utility methods for cart totals
  getCartTotalValue(): number {
    return this.currentCartSummary?.totalAmount || 0;
  }

  getTotalCartItemsFromAPI(): number {
    return this.currentCartSummary?.totalItems || 0;
  }

  // Cart navigation method
  onViewCart(): void {
    this.router.navigate(['/apps/cart']);
    this.messageService.add({
      severity: 'info',
      summary: 'Cart',
      detail: 'Navigating to cart...',
      life: 2000
    });
  }

  // Buy now method with API integration
  onBuyNow(): void {
    // First add to cart via API
    this.onAddToCart();
    
    // Wait for cart addition to complete, then navigate to checkout
    setTimeout(() => {
      this.router.navigate(['/apps/checkout'], {
        queryParams: { 
          direct: true, 
          productId: this.product.id, 
          quantity: this.quantity,
          fromProduct: true
        }
      });
    }, 1500);

    this.messageService.add({
      severity: 'info',
      summary: 'Redirecting to Checkout',
      detail: 'Taking you to checkout...',
      life: 3000
    });
  }

  // Rest of the existing methods remain the same...
  private loadProductData(productId: number): void {
    console.log('Loading product data for ID:', productId);
    
    // Get product from home service
    const homeProduct = this.homeService.getProductById(productId);
    
    if (homeProduct) {
      console.log('Found home product:', homeProduct);
      
      // Map home product data to detail product format
      this.product = {
        id: homeProduct.id,
        name: homeProduct.title || homeProduct.name || 'Product Name',
        title: homeProduct.title || homeProduct.name || 'Product Name',
        price: homeProduct.price || 0,
        originalPrice: homeProduct.originalPrice || (homeProduct.price ? homeProduct.price + Math.floor(homeProduct.price * 0.2) : 0),
        discount: homeProduct.originalPrice && homeProduct.price ? 
          Math.round(((homeProduct.originalPrice - homeProduct.price) / homeProduct.originalPrice) * 100) : 17,
        rating: homeProduct.rating || 4.0,
        reviewCount: homeProduct.reviewCount || Math.floor(Math.random() * 30) + 5,
        inStock: homeProduct.inStock !== false,
        brand: homeProduct.brand || this.extractBrandFromTitle(homeProduct.title || ''),
        model: homeProduct.model || this.extractModelFromTitle(homeProduct.title || ''),
        description: this.generateDescription(homeProduct),
        features: this.generateFeatures(homeProduct),
        images: this.generateImages(homeProduct),
        category: homeProduct.category,
        user: homeProduct.user,
        time: homeProduct.time,
        wishList: homeProduct.wishList || false,
        featuredPost: homeProduct.featuredPost || false,
        maxQuantity: homeProduct.maxQuantity || 10,
        stockQuantity: homeProduct.stockQuantity || homeProduct.maxQuantity || 10,
        imgSrc: homeProduct.imgSrc
      };

      // Set current image
      this.currentImage = this.product.images[0]?.itemImageSrc || homeProduct.imgSrc || '';
      
      // Update cart status for this product
      this.updateCartStatus();
      
      // Update wishlist status after product is loaded
      this.updateWishlistStatus();
      
      console.log('Mapped product data:', this.product);
    } else {
      console.error('Product not found for ID:', productId);
      
      // Show error message and navigate back
      this.messageService.add({
        severity: 'error',
        summary: 'Product Not Found',
        detail: 'The requested product could not be found.'
      });
      
      setTimeout(() => {
        this.router.navigate(['/apps/home']);
      }, 2000);
    }
  }

  private generateDescription(homeProduct: any): string {
    if (homeProduct.description) {
      return homeProduct.description;
    }

    const title = homeProduct.title || homeProduct.name || '';
    const category = homeProduct.category || '';
    
    if (title.toLowerCase().includes('tv') || title.toLowerCase().includes('television')) {
      return 'Experience stunning picture quality with crystal-clear display technology. This smart TV delivers exceptional performance with vibrant colors and sharp details, perfect for your entertainment needs.';
    } else if (title.toLowerCase().includes('phone') || title.toLowerCase().includes('mobile')) {
      return 'Stay connected with this feature-rich smartphone offering excellent performance, stunning camera quality, and long-lasting battery life for all your daily needs.';
    } else if (title.toLowerCase().includes('laptop') || title.toLowerCase().includes('computer')) {
      return 'Power through your work and entertainment with this high-performance device featuring advanced processors, ample storage, and sleek design for modern productivity.';
    } else if (title.toLowerCase().includes('headphone') || title.toLowerCase().includes('earphone')) {
      return 'Immerse yourself in premium audio quality with exceptional sound clarity, comfortable design, and advanced noise cancellation technology.';
    } else if (category.toLowerCase().includes('electronics')) {
      return 'Discover cutting-edge technology designed to enhance your lifestyle with innovative features, reliable performance, and exceptional quality.';
    } else if (category.toLowerCase().includes('fashion') || category.toLowerCase().includes('clothing')) {
      return 'Express your unique style with this carefully crafted piece featuring premium materials, perfect fit, and contemporary design elements.';
    } else {
      return `Discover the perfect blend of quality, style, and functionality with ${title}. Designed to meet your highest expectations and deliver exceptional value.`;
    }
  }

  private generateFeatures(homeProduct: any): string[] {
    const title = homeProduct.title || homeProduct.name || '';
    
    if (title.toLowerCase().includes('tv')) {
      return [
        'Crystal Clear 4K UHD Display',
        'Smart TV with Streaming Apps',
        'HDR Support for Enhanced Colors',
        'Voice Control Compatible',
        'Multiple HDMI Ports'
      ];
    } else if (title.toLowerCase().includes('phone')) {
      return [
        'High-Resolution Camera System',
        'Fast Charging Technology',
        'Water & Dust Resistant',
        'Face Recognition & Fingerprint',
        'All-Day Battery Life'
      ];
    } else if (title.toLowerCase().includes('laptop')) {
      return [
        'Intel/AMD High-Performance Processor',
        'Full HD Display',
        'Fast SSD Storage',
        'Long Battery Life',
        'Lightweight & Portable Design'
      ];
    } else if (title.toLowerCase().includes('headphone')) {
      return [
        'Active Noise Cancellation',
        'Premium Audio Quality',
        'Comfortable Over-Ear Design',
        'Wireless Bluetooth Connection',
        '30+ Hours Battery Life'
      ];
    } else {
      return [
        'Premium Quality Materials',
        'Modern Design',
        'Excellent Performance',
        'Great Value for Money',
        'Warranty Included'
      ];
    }
  }

  private generateImages(homeProduct: any): Array<{itemImageSrc: string, thumbnailImageSrc: string, alt: string}> {
    const mainImage = homeProduct.imgSrc || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop';
    const title = homeProduct.title || homeProduct.name || 'Product';
    
    return [
      {
        itemImageSrc: mainImage,
        thumbnailImageSrc: mainImage.replace('w=800&h=600', 'w=150&h=150'),
        alt: `${title} - Main View`
      },
      {
        itemImageSrc: mainImage.replace('photo-1593359677879-a4bb92f829d1', 'photo-1586023492125-27b2c045efd7'),
        thumbnailImageSrc: mainImage.replace('photo-1593359677879-a4bb92f829d1', 'photo-1586023492125-27b2c045efd7').replace('w=800&h=600', 'w=150&h=150'),
        alt: `${title} - Side View`
      },
      {
        itemImageSrc: mainImage.replace('photo-1593359677879-a4bb92f829d1', 'photo-1560472354-b33ff0c44a43'),
        thumbnailImageSrc: mainImage.replace('photo-1593359677879-a4bb92f829d1', 'photo-1560472354-b33ff0c44a43').replace('w=800&h=600', 'w=150&h=150'),
        alt: `${title} - Detail View`
      }
    ];
  }

  private extractBrandFromTitle(title: string): string {
    const commonBrands = ['Samsung', 'Apple', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Nike', 'Adidas', 'Canon', 'Nikon'];
    const titleWords = title.split(' ');
    
    for (const word of titleWords) {
      const brand = commonBrands.find(b => b.toLowerCase() === word.toLowerCase());
      if (brand) return brand;
    }
    
    return titleWords[0] || 'Premium Brand';
  }

  private extractModelFromTitle(title: string): string {
    const match = title.match(/([A-Z0-9]+[-]?[A-Z0-9]*)/i);
    return match ? match[1] : 'Model';
  }

  private loadRelatedProducts(): void {
    const allProducts = this.homeService.products || [];
    
    this.relatedProducts = allProducts
      .filter(product => product.id !== this.product.id)
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        name: product.title || product.name || 'Product Name',
        price: product.price || 0,
        originalPrice: product.originalPrice || (product.price ? product.price + Math.floor(product.price * 0.15) : 0),
        image: product.imgSrc || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop',
        rating: product.rating || 4.0,
        reviewCount: Math.floor(Math.random() * 30) + 5,
        badge: product.featuredPost ? 'Featured' : (Math.random() > 0.5 ? 'New Arrival' : 'Best Seller')
      }));

    this.recommendedProducts = [...this.relatedProducts];
    console.log('Loaded related products:', this.relatedProducts);
  }

  // Image selection methods
  selectImage(index: number) {
    this.selectedImageIndex = index;
    this.currentImage = this.product.images[index].itemImageSrc;
  }

  // Quantity management methods
  increaseQuantity() {
    const maxQuantity = this.product.maxQuantity || 10;
    if (this.quantity < maxQuantity) {
      this.quantity++;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Maximum Quantity Reached',
        detail: `Maximum ${maxQuantity} items allowed`
      });
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }



  onContactSeller() {
    this.messageService.add({
      severity: 'info',
      summary: 'Contact Seller',
      detail: 'Opening seller contact options...'
    });
  }

  // Updated review methods
  onWriteReview() {
    this.showReviewForm = !this.showReviewForm;
    
    if (this.showReviewForm) {
      // Reset form when showing
      this.reviewForm.reset();
      this.reviewForm.patchValue({
       
        rating: 0,
        comment: ''
      });
      
      // Scroll to review form
      setTimeout(() => {
        const reviewFormElement = document.getElementById('review-form');
        if (reviewFormElement) {
          reviewFormElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

onSubmitReview() {
  if (this.reviewForm.invalid || this.isSubmittingReview) {
    Object.values(this.reviewForm.controls).forEach(c => c.markAsTouched());
    return;
  }

  this.isSubmittingReview = true;
  const { comment, rating } = this.reviewForm.value;

  const payload = {
    storeId:    '32701114-3f77-42b4-216b-08ddb7d0de62',
    customerId: Number(sessionStorage.getItem('customer_id')),
    productId:  String(this.product.id),
    rating,
    reviewText: comment,
    isApproved: true
  };

  this.apiService.submitProductReview(payload)
    .subscribe({
      next: () => {
       
        this.reviewForm.reset();
        this.showReviewForm = false;
        this.isSubmittingReview = false;

       
        this.loadReviews(String(this.product.id));

        this.snackBar.open(
          'Review submitted successfully!',
          'Close',
          { duration: 3000, horizontalPosition: 'center', verticalPosition: 'bottom' }
        );
      },
      error: () => {
        this.isSubmittingReview = false;
        this.snackBar.open('Failed to submit review', 'Close', { duration: 3000 });
      }
    });
}
loadReviews(productId: string) {
  this.apiService.getAllProductReviews(productId).subscribe({
    next: async (res: any) => {
      const approved = res.result.items.filter((r: any) => r.isApproved);

      const reviewStreams = approved.map(async (rev: any) => {
        const cust = await this.apiService.getCustomerById(rev.customerId).toPromise();
        const fullName = cust.result.fullName;
        return {
          id: rev.id,
          user: fullName,
          rating: rev.rating,
          comment: rev.reviewText,
          date: new Date().toLocaleDateString(),
          avatar: this.generateAvatar(fullName)
        };
      });

      const list = await Promise.all(reviewStreams);
      this.reviews = list;
      this.updateProductRating();
      this.page = 1;
      this.displayedReviews = this.reviews.slice(0, this.page * this.pageSize);
    },
    error: err => console.error('Failed to load reviews', err)
  });
}
generateAvatar(fullName: string): string {
  return fullName?.charAt(0).toUpperCase() || '?';
}

onLoadMoreReviews() {
  this.page++;
  const nextSlice = this.reviews.slice(0, this.page * this.pageSize);
  this.displayedReviews = nextSlice;
}


  onCancelReview() {
    this.showReviewForm = false;
    this.reviewForm.reset();
  }

  private addNewReview(reviewData: any) {
    const review: Review = {
      id: this.reviews.length + 1,
      user: reviewData.user,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      avatar: this.getInitials(reviewData.user)
    };

    this.reviews.unshift(review);
    this.updateProductRating();

    this.snackBar.open('Review submitted successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private updateProductRating() {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.product.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.product.reviewCount = this.reviews.length;
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  onViewRelatedProduct(productId: number) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/apps/product-detail', productId]);
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  getTotalSavings(): number {
    if (!this.product.originalPrice || this.product.originalPrice <= this.product.price) return 0;
    return (this.product.originalPrice - this.product.price) * this.quantity;
  }


  getProductQuantityInCart(productId: string | number): number {
    const cartItem = this.getCartItemForProduct(Number(productId));
    return cartItem ? cartItem.quantity : 0;
  }

  // Add trackBy function for *ngFor performance
  trackByProductId(index: number, product: any): number {
    return product.id || product.productId || index;
  }

}