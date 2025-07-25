import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeService } from './home-page.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { CartService, CartItem, CartSummary } from '../add-to-cart/add-to-cart.service';
import { ApiService } from 'src/app/services/api.service';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  action?: string;
}

export interface Category {
  id: string | number;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  customIcon?: string;
  productCount?: number;
  isNew?: boolean;
  isPopular?: boolean;
  image?: string;
  subCategories?: SubCategory[];
  categoryId?: number;
}

export interface SubCategory {
  id: string | number;
  name: string;
  categoryId: number;
  slug?: string;
  description?: string;
  productCount?: number;
  subSubCategories?: SubSubCategory[];
}

export interface SubSubCategory {
  id: string | number;
  name: string;
  subCategoryId: number;
  slug?: string;
  description?: string;
  productCount?: number;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SharedModule, PrimeSharedModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers: [MessageService]
})
export class HomePageComponent implements OnInit, OnDestroy {

  // ============= PROPERTIES =============

  // Menu and Navigation
  items: MenuItem[] | undefined;

  // Carousel
  currentSlide = 0;
  carouselInterval: any;
  autoPlayInterval = 5000;

  // Loading States
  isLoading = false;
  loadingError: string | null = null;
  addingToCart = false;
  wishlistLoading = false;
  categoriesLoading = false;

  // Product Data
  categories: string[] = [];
  selectedCategory: string = 'all';
  featuredProducts: any[] = [];
  saleProducts: any[] = [];
  newArrivals: any[] = [];

  // Cart
  cartItems$: Observable<CartItem[]>;
  cartSummary$: Observable<CartSummary>;
  showCartSidebar = false;

  // Wishlist
  wishlistItems: any[] = [];
  wishlistProductIds: Set<string> = new Set();

  // Utils
  private subscriptions: Subscription[] = [];
  private customerId: number = 4; // Replace with actual customer ID from auth
  Math = Math;

  carouselSlides: CarouselSlide[] = [
    {
      id: 1,
      title: 'Summer Collection 2024',
      description: 'Discover our latest summer fashion trends with up to 50% off',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      buttonText: 'Shop Now',
      action: 'summer-collection'
    },
    {
      id: 2,
      title: 'Electronics Sale',
      description: 'Latest gadgets and electronics at unbeatable prices',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2126&q=80',
      buttonText: 'Explore',
      action: 'electronics'
    },
    {
      id: 3,
      title: 'Home & Garden',
      description: 'Transform your space with our premium home decor collection',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2158&q=80',
      buttonText: 'View Collection',
      action: 'home-garden'
    },
    {
      id: 4,
      title: 'Free Shipping',
      description: 'Free shipping on all orders above $50. Limited time offer!',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      buttonText: 'Learn More',
      action: 'free-shipping'
    }
  ];

  // Dynamic categories from API
  category: Category[] = [];

  // ============= CONSTRUCTOR =============

  constructor(
    public router: Router,
    public homeService: HomeService,
    private cartService: CartService,
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartSummary$ = this.cartService.cartSummary$;
  }

  // ============= LIFECYCLE METHODS =============

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.startAutoPlay();
    this.initializeMenuItems();
    this.subscribeToCartUpdates();
    this.loadWishlist();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ============= CATEGORY METHODS =============
  private loadCategories(): void {
    this.categoriesLoading = true;

    const categoriesSubscription = this.apiService.getCategoriesWithSubCategories().subscribe({
      next: (categories: Category[]) => {
        console.log('Categories loaded:', categories);
        this.category = this.processCategories(categories);
        this.categoriesLoading = false;

        // Update menu items with new categories
        this.updateMenuItemsWithCategories();

        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Categories Loaded',
        //   detail: `${this.category.length} categories loaded successfully`,
        //   life: 3000
        // });
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categoriesLoading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Categories Loading Error',
          detail: 'Failed to load categories. Please try again.',
          life: 5000
        });
      }
    });

    this.subscriptions.push(categoriesSubscription);
  }

  private processCategories(categories: Category[]): Category[] {
    return categories.map(category => ({
      ...category,
      slug: this.generateSlug(category.name),
      icon: this.getCategoryIcon(category.name),
      // Use actual product count from API if available, otherwise don't show count
      productCount: category.productCount || undefined,
      // Remove dummy random logic - use actual API data
      isNew: category.isNew || false,
      isPopular: category.isPopular || false,
      description: category.description || this.generateCategoryDescription(category.name)
    }));
  }

  private generateSlug(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'electronics': 'devices',
      'fashion': 'checkroom',
      'clothing': 'checkroom',
      'home': 'home',
      'garden': 'local_florist',
      'sports': 'fitness_center',
      'fitness': 'fitness_center',
      'books': 'menu_book',
      'media': 'play_circle',
      'beauty': 'spa',
      'health': 'local_hospital',
      'automotive': 'directions_car',
      'toys': 'toys',
      'games': 'sports_esports',
      'food': 'restaurant',
      'grocery': 'local_grocery_store',
      'jewelry': 'diamond',
      'watches': 'watch',
      'shoes': 'hiking',
      'bags': 'work',
      'furniture': 'chair',
      'appliances': 'kitchen',
      'tools': 'build',
      'pet': 'pets',
      'baby': 'child_friendly',
      'music': 'music_note',
      'outdoor': 'outdoor_grill'
    };

    const lowerCaseName = categoryName.toLowerCase();

    // Find matching icon
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (lowerCaseName.includes(keyword)) {
        return icon;
      }
    }

    return 'category'; // Default icon
  }

  private generateCategoryDescription(categoryName: string): string {
    const descriptions: { [key: string]: string } = {
      'electronics': 'Latest gadgets and electronic devices',
      'fashion': 'Trendy clothing and fashion accessories',
      'clothing': 'Trendy clothing and fashion accessories',
      'home': 'Everything for your home and living space',
      'garden': 'Plants, tools, and outdoor essentials',
      'sports': 'Sports equipment and fitness gear',
      'fitness': 'Sports equipment and fitness gear',
      'books': 'Books, magazines, and educational materials',
      'media': 'Books, magazines, and educational materials',
      'beauty': 'Beauty products and personal care items',
      'health': 'Health and wellness products',
      'automotive': 'Car parts, accessories, and maintenance',
      'toys': 'Fun toys and games for all ages',
      'games': 'Fun toys and games for all ages',
      'food': 'Fresh food and grocery items',
      'grocery': 'Fresh food and grocery items',
      'jewelry': 'Beautiful jewelry and accessories',
      'watches': 'Beautiful jewelry and accessories',
      'shoes': 'Quality footwear for every occasion',
      'bags': 'Stylish bags and accessories',
      'furniture': 'Quality furniture for your home',
      'appliances': 'Home appliances and kitchen essentials',
      'tools': 'Professional and DIY tools',
      'pet': 'Pet supplies and accessories',
      'baby': 'Baby care and children\'s products',
      'music': 'Musical instruments and audio equipment',
      'outdoor': 'Outdoor and recreational equipment'
    };

    const lowerCaseName = categoryName.toLowerCase();

    // Find matching description
    for (const [keyword, desc] of Object.entries(descriptions)) {
      if (lowerCaseName.includes(keyword)) {
        return desc;
      }
    }

    return `Explore our ${categoryName.toLowerCase()} collection`;
  }

  // Remove the getFallbackCategories method entirely

  private updateMenuItemsWithCategories(): void {
    if (this.items) {
      const categoryMenuItem = this.items.find(item => item.label === 'Categories');
      if (categoryMenuItem) {
        categoryMenuItem.badge = this.category.length.toString();
        categoryMenuItem.items = this.category.map(category => ({
          label: category.name,
          icon: 'pi pi-tag',
          command: () => this.onCategoryClick(category)
        }));
      }
    }
  }

  // Fixed onCategoryClick method
  onCategoryClick(category: Category): void {
    console.log('Category clicked:', category);

    // Debug: Check what data we have
    console.log('Category ID:', category.id);
    console.log('Category slug:', category.slug);
    console.log('Category name:', category.name);

    // Store selected category
    this.selectedCategory = category.slug || category.name.toLowerCase();

    // Navigate to category page - use the correct route path
    if (category.id) {
      // Use ID first as it's more reliable
      this.router.navigate(['/apps/category', category.id]);
    } else {
      // Last resort: use name as slug
      const generatedSlug = this.generateSlug(category.name);
      this.router.navigate(['/apps/category', generatedSlug]);
    }

    // Show success message
    this.messageService.add({
      severity: 'info',
      summary: 'Category Selected',
      detail: `Viewing products in ${category.name}`,
      life: 3000
    });
  }
  viewAllCategories(): void {
    console.log('View all categories clicked');
    this.router.navigate(['/apps/categories']);
  }

  // Filter products by category
  filterProductsByCategory(categoryId: string | number): any[] {
    if (!categoryId || categoryId === 'all') {
      return this.homeService.products;
    }

    return this.homeService.products.filter(product =>
      product.categoryId === categoryId ||
      product.category === categoryId.toString()
    );
  }

  // Get category by ID
  getCategoryById(categoryId: string | number): Category | undefined {
    return this.category.find(cat => cat.id === categoryId);
  }

  // Get category statistics
  getCategoryStats(): { total: number, new: number, popular: number } {
    return {
      total: this.category.length,
      new: this.category.filter(cat => cat.isNew).length,
      popular: this.category.filter(cat => cat.isPopular).length
    };
  }

  // Refresh categories
  refreshCategories(): void {
    this.loadCategories();
  }

  // Add search functionality for categories
  searchCategories(keyword: string): void {
    if (!keyword.trim()) {
      this.loadCategories();
      return;
    }

    this.categoriesLoading = true;

    const searchSubscription = this.apiService.getCategoriesWithSubCategories(keyword).subscribe({
      next: (categories: Category[]) => {
        console.log('Search results:', categories);
        this.category = this.processCategories(categories);
        this.categoriesLoading = false;

        this.messageService.add({
          severity: 'info',
          summary: 'Search Results',
          detail: `Found ${this.category.length} categories matching "${keyword}"`,
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error searching categories:', error);
        this.categoriesLoading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Search Error',
          detail: 'Failed to search categories. Please try again.',
          life: 5000
        });
      }
    });

    this.subscriptions.push(searchSubscription);
  }

  // ============= PRODUCT METHODS =============

  private loadProducts(): void {
    this.isLoading = true;
    this.loadingError = null;

    const productSubscription = this.homeService.getBlog().subscribe({
      next: (products: any[]) => {
        this.homeService.products = products;
        this.processProductsData(products);
        this.updateProductWishlistStatus();
        this.isLoading = false;

        // if (products.length > 0) {
        //   this.messageService.add({
        //     severity: 'success',
        //     summary: 'Products Loaded',
        //     detail: `${products.length} products loaded successfully`,
        //     life: 3000
        //   });
        // }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loadingError = 'Failed to load products. Please try again later.';
        this.isLoading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Loading Error',
          detail: 'Failed to load products. Using fallback data.',
          life: 5000
        });
      }
    });

    this.subscriptions.push(productSubscription);
  }

  private processProductsData(products: any[]): void {
    this.categories = ['all', ...new Set(products.map(p => p.category).filter(c => c))];
    this.featuredProducts = this.homeService.getFeaturedProducts(6);
    this.saleProducts = this.homeService.getSaleProducts(6);
    this.newArrivals = this.getNewArrivals(products, 6);
  }

  private getNewArrivals(products: any[], limit: number): any[] {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProducts = products.filter(product => {
      const createdDate = new Date(product.createdAt || product.time);
      return createdDate > thirtyDaysAgo;
    });

    return recentProducts.length === 0 ? products.slice(0, limit) : recentProducts.slice(0, limit);
  }

  selectBlog(productId: number): void {
    const selectedProduct = this.homeService.products.find(product => product.id === productId);

    if (selectedProduct) {
      this.homeService.selectedProduct = selectedProduct;
      this.homeService.detailId = productId.toString();
      this.router.navigate(['/apps/product-detail', productId]);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Product Not Found',
        detail: 'The selected product could not be found.',
        life: 3000
      });
    }
  }

  onProductClick(product: any): void {
    this.selectBlog(product.id);
  }

  retryLoadProducts(): void {
    this.loadProducts();
  }

  refreshProducts(): void {
    this.loadProducts();
    this.loadWishlist();
  }

  // ============= CART METHODS =============

  private subscribeToCartUpdates(): void {
    const cartSubscription = this.cartSummary$.subscribe(summary => {
      this.updateMenuBadges();
    });
    this.subscriptions.push(cartSubscription);
  }

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
          this.updateMenuBadges();
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

    if (!product.inStock || (product.stockQuantity && product.stockQuantity < quantity)) {
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
        }
      });

      this.subscriptions.push(updateSubscription);
    }
  }

  getCartItemsCount(): number {
    return this.cartService.getCartItemCount();
  }

  getCartTotal(): number {
    return this.cartService.getCartSummary().total;
  }

  isProductInCart(productId: number | string): boolean {
    return this.cartService.isInCart(productId?.toString());
  }

  getProductQuantityInCart(productId: number | string): number {
    return this.cartService.getItemQuantityInCart(productId?.toString());
  }

  toggleCartSidebar(): void {
    this.showCartSidebar = !this.showCartSidebar;
  }

  goToCart(): void {
    this.router.navigate(['/apps/add-to-cart']);
  }

  goToCheckout(): void {
    this.router.navigate(['/apps/checkout']);
  }

  // ============= WISHLIST METHODS =============

  private loadWishlist(): void {
    if (!this.customerId) {
      console.warn('Customer ID not available, skipping wishlist load');
      return;
    }

    const wishlistSubscription = this.apiService.getWishlist(this.customerId).subscribe({
      next: (response) => {
        const wishlistData = response?.result || response?.data || response;

        if (Array.isArray(wishlistData)) {
          this.wishlistItems = wishlistData;
          this.wishlistProductIds = new Set(wishlistData.map(item => item.productId || item.id));
        } else if (wishlistData?.items && Array.isArray(wishlistData.items)) {
          this.wishlistItems = wishlistData.items;
          this.wishlistProductIds = new Set(wishlistData.items.map((item: { productId: any; id: any; }) => item.productId || item.id));
        } else {
          this.wishlistItems = [];
          this.wishlistProductIds = new Set();
        }

        this.updateProductWishlistStatus();
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Wishlist Error',
          detail: 'Failed to load wishlist items',
          life: 3000
        });
      }
    });

    this.subscriptions.push(wishlistSubscription);
  }

  private updateProductWishlistStatus(): void {
    const allProducts = [
      ...this.homeService.products,
      ...this.featuredProducts,
      ...this.saleProducts,
      ...this.newArrivals
    ];

    allProducts.forEach(product => {
      const productId = product.id?.toString() || product.productId?.toString();
      if (productId) {
        product.wishLis = this.wishlistProductIds.has(productId);
        product.wishList = product.wishLis;
      }
    });
  }

  toggleWishlist(product: any): void {
    if (!this.validateWishlistOperation(product)) return;

    const productId = (product.id || product.productId).toString();
    const isCurrentlyInWishlist = this.isProductInWishlist(product);

    this.wishlistLoading = true;

    // Optimistic update
    product.wishLis = !isCurrentlyInWishlist;
    product.wishList = product.wishLis;

    const apiCall = isCurrentlyInWishlist
      ? this.apiService.removeFromWishlist(this.customerId, productId)
      : this.apiService.addToWishlist(this.customerId, productId);

    const wishlistSubscription = apiCall.subscribe({
      next: (response) => {
        this.updateWishlistState(productId, product, isCurrentlyInWishlist);
        this.wishlistLoading = false;

        this.messageService.add({
          severity: 'success',
          summary: isCurrentlyInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
          detail: `${product.title || product.name} ${isCurrentlyInWishlist ? 'removed from' : 'added to'} your wishlist`,
          life: 3000
        });

        this.updateMenuBadges();
      },
      error: (error) => {
        console.error('Error updating wishlist:', error);
        this.wishlistLoading = false;

        // Revert optimistic update
        product.wishLis = isCurrentlyInWishlist;
        product.wishList = isCurrentlyInWishlist;

        this.messageService.add({
          severity: 'error',
          summary: 'Wishlist Error',
          detail: 'Failed to update wishlist. Please try again.',
          life: 3000
        });
      }
    });

    this.subscriptions.push(wishlistSubscription);
  }

  private validateWishlistOperation(product: any): boolean {
    if (!this.customerId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please login to manage your wishlist',
        life: 3000
      });
      return false;
    }

    if (!product?.id && !product?.productId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Product',
        detail: 'Cannot add invalid product to wishlist',
        life: 3000
      });
      return false;
    }

    return true;
  }

  private updateWishlistState(productId: string, product: any, wasInWishlist: boolean): void {
    if (wasInWishlist) {
      this.wishlistProductIds.delete(productId);
      this.wishlistItems = this.wishlistItems.filter(item =>
        (item.productId || item.id).toString() !== productId
      );
    } else {
      this.wishlistProductIds.add(productId);
      if (!this.wishlistItems.find(item =>
        (item.productId || item.id).toString() === productId)) {
        this.wishlistItems.push({
          productId: productId,
          product: product,
          ...product
        });
      }
    }
  }

  isProductInWishlist(product: any): boolean {
    if (!product) return false;
    const productId = (product.id || product.productId)?.toString();
    return productId ? this.wishlistProductIds.has(productId) : false;
  }

  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  goToWishlist(): void {
    this.router.navigate(['/apps/wishlist']);
  }

  clearWishlist(): void {
    if (!this.customerId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please login to clear your wishlist',
        life: 3000
      });
      return;
    }

    if (this.wishlistItems.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Wishlist Empty',
        detail: 'Your wishlist is already empty',
        life: 3000
      });
      return;
    }

    const clearSubscription = this.apiService.clearWishlist(this.customerId).subscribe({
      next: (response) => {
        this.wishlistItems = [];
        this.wishlistProductIds.clear();
        this.updateProductWishlistStatus();

        this.messageService.add({
          severity: 'success',
          summary: 'Wishlist Cleared',
          detail: 'All items have been removed from your wishlist',
          life: 3000
        });

        this.updateMenuBadges();
      },
      error: (error) => {
        console.error('Error clearing wishlist:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to clear wishlist. Please try again.',
          life: 3000
        });
      }
    });

    this.subscriptions.push(clearSubscription);
  }

  // ============= CAROUSEL METHODS =============

  startAutoPlay(): void {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayInterval);
  }

  stopAutoPlay(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0
      ? this.carouselSlides.length - 1
      : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.stopAutoPlay();
    setTimeout(() => {
      this.startAutoPlay();
    }, 3000);
  }

  getSlideTransform(): string {
    return `translateX(${-this.currentSlide * 100}%)`;
  }

  // Touch/swipe support
  private touchStartX = 0;
  private touchEndX = 0;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.previousSlide();
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.nextSlide();
        event.preventDefault();
        break;
      case 'Escape':
        this.stopAutoPlay();
        break;
    }
  }

  // ============= MENU AND NAVIGATION =============

  private initializeMenuItems(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: 'Categories',
        icon: 'pi pi-search',
        badge: this.categories.length.toString(),
        items: this.categories.map(category => ({
          label: this.formatCategoryName(category),
          icon: 'pi pi-tag',
        }))
      },
      {
        label: 'Wishlist',
        icon: 'pi pi-heart',
        badge: this.getWishlistCount().toString(),
        command: () => this.goToWishlist()
      },
      {
        label: 'Cart',
        icon: 'pi pi-shopping-cart',
        badge: '0',
        command: () => this.goToCart()
      }
    ];
  }

  private formatCategoryName(category: string): string {
    if (category === 'all') return 'All Products';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  private updateMenuBadges(): void {
    if (this.items) {
      const cartItem = this.items.find(item => item.label === 'Cart');
      if (cartItem) {
        cartItem.badge = this.getCartItemsCount().toString();
      }

      const wishlistItem = this.items.find(item => item.label === 'Wishlist');
      if (wishlistItem) {
        wishlistItem.badge = this.getWishlistCount().toString();
      }
    }
  }

  // ============= UTILITY METHODS =============

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

    return this.getDefaultProductImage(product);
  }

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

  onImageError(event: any, product: any): void {
    event.target.src = this.getDefaultProductImage(product);
  }

  hasDiscount(product: any): boolean {
    const originalPrice = product.originalPrice || product.regularPrice;
    return originalPrice && originalPrice > product.price;
  }

  getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  formatPrice(price: number): string {
    if (!price) return 'PKR 0';
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  getStarArray(rating: number): number[] {
    const filledStars = Math.floor(rating);
    return Array(filledStars).fill(0);
  }

  getEmptyStarArray(rating: number): number[] {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;
    return Array(emptyStars).fill(0);
  }

  getPriceDisplay(product: any): { current: string; original?: string; discount?: number } {
    const current = this.formatPrice(product.price);
    const originalPrice = product.originalPrice || product.regularPrice;

    if (this.hasDiscount(product)) {
      return {
        current,
        original: this.formatPrice(originalPrice),
        discount: this.getDiscountPercentage(originalPrice, product.price)
      };
    }

    return { current };
  }

  isProductAvailable(product: any): boolean {
    return product.inStock !== false &&
      (!product.stockQuantity || product.stockQuantity > 0);
  }

  getAvailabilityText(product: any): string {
    if (!this.isProductAvailable(product)) {
      return 'Out of Stock';
    }

    if (product.stockQuantity && product.stockQuantity < 5) {
      return `Only ${product.stockQuantity} left`;
    }

    return 'In Stock';
  }

  // Performance optimization - track by functions
  trackByProductId(index: number, product: any): any {
    return product.id || product.productId || index;
  }

  trackBySlideId(index: number, slide: CarouselSlide): any {
    return slide.id || index;
  }

}