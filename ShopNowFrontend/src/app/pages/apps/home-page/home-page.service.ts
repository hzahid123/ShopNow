import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { products } from './home-page.model'; // Keep as fallback
import { ProductService } from '../manage-prodcuts/manage-products.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  products: any[] = [];
  selectedProduct: any = null;
  detailId: string = '';
  private useDatabase: boolean = true; // Flag to control data source

  constructor(
    public http: HttpClient,
    private productService: ProductService
  ) { }

  public getBlog(): Observable<any> {
    if (this.useDatabase) {
      return this.getDatabaseProducts();
    } else {
      return of(products); // Fallback to hardcoded data
    }
  }

  // New method to get products from database
  private getDatabaseProducts(): Observable<any> {
    return this.productService.getAllProducts().pipe(
      map((response: any) => {
        if (response && response.result && response.result.items) {
          return this.mapDatabaseProductsToHomeFormat(response.result.items);
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching database products, falling back to hardcoded:', error);
        return of(products); // Fallback to hardcoded data on error
      })
    );
  }

  // Map database products to home page format with enhanced data
  private mapDatabaseProductsToHomeFormat(dbProducts: any[]): any[] {
    return dbProducts.map((dbProduct, index) => {
      // Extract dimensions if available
      const dimensions = this.parseDimensions(dbProduct.dimensions);

      return {
        // Core database fields
        id: dbProduct.id || (index + 1),
        title: dbProduct.name || `Product ${index + 1}`,
        name: dbProduct.name || `Product ${index + 1}`,
        description: dbProduct.description || this.generateDescription(dbProduct.name),
        price: dbProduct.price || this.generateRandomPrice(),
        stockQuantity: dbProduct.stockQuantity || 10,

        // Enhanced fields with fallbacks
        originalPrice: this.calculateOriginalPrice(dbProduct.price),
        salePrice: dbProduct.price,
        regularPrice: this.calculateOriginalPrice(dbProduct.price),

        // Category information
        category: this.getCategoryName(dbProduct.categoryId) || 'Electronics',
        categoryId: dbProduct.categoryId,
        subCategoryId: dbProduct.subCategoryId,
        subSubCategoryId: dbProduct.subSubCategoryId,

        // Stock and availability
        inStock: (dbProduct.stockQuantity || 0) > 0,
        maxQuantity: dbProduct.stockQuantity || 10,

        // Images - using generated images since database doesn't have image URLs
        imgSrc: this.generateProductImage(dbProduct.name, index),
        image: this.generateProductImage(dbProduct.name, index),
        imageUrl: this.generateProductImage(dbProduct.name, index),
        thumbnail: this.generateThumbnail(dbProduct.name, index),

        // Rating and reviews (generated)
        rating: this.generateRandomRating(),
        reviewCount: this.generateRandomReviewCount(),

        // Brand and model (extracted from name)
        brand: this.extractBrandFromTitle(dbProduct.name || ''),
        manufacturer: this.extractBrandFromTitle(dbProduct.name || ''),
        model: this.extractModelFromTitle(dbProduct.name || ''),
        sku: `SKU-${dbProduct.id?.substring(0, 8) || Math.random().toString(36).substring(2, 10)}`,

        // Product specifications
        dimensions: dimensions,
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
        weight: this.generateWeight(dbProduct.name),

        // Store information
        storeId: dbProduct.storeId,

        // UI states
        wishLis: false,
        wishList: false,
        featuredPost: Math.random() > 0.8, // 20% chance of being featured

        // Timestamps
        time: dbProduct.createdAt || new Date().toISOString(),
        createdAt: dbProduct.createdAt || new Date().toISOString(),
        updatedAt: dbProduct.updatedAt || new Date().toISOString(),

        // Additional e-commerce fields
        badge: this.generateBadge(dbProduct),
        discount: this.calculateDiscount(dbProduct.price, this.calculateOriginalPrice(dbProduct.price)),
        tags: this.generateTags(dbProduct.name),

        // Shipping and returns
        freeShipping: (dbProduct.price || 0) > 50,
        fastDelivery: Math.random() > 0.5,
        returnPolicy: '30-day return policy',

        // SEO and meta
        slug: this.generateSlug(dbProduct.name || ''),
        metaTitle: dbProduct.name || '',
        metaDescription: (dbProduct.description || '').substring(0, 160),

        // Additional product details
        warranty: this.generateWarranty(dbProduct.name),
        features: this.generateFeatures(dbProduct.name),
        specifications: this.generateSpecifications(dbProduct),

        // User information (from original model structure)
        user: 'Admin',
        userImg: 'assets/images/profile/user-1.jpg'
      };
    });
  }

  // Helper method to parse dimensions string
  private parseDimensions(dimensionsStr: string): { length: number, width: number, height: number } {
    if (!dimensionsStr) {
      return { length: 10, width: 10, height: 5 };
    }

    try {
      const parts = dimensionsStr.split(',').map(p => parseFloat(p.trim()));
      return {
        length: parts[0] || 10,
        width: parts[1] || 10,
        height: parts[2] || 5
      };
    } catch {
      return { length: 10, width: 10, height: 5 };
    }
  }

  // Generate category name based on ID (you might want to cache categories)
  private getCategoryName(categoryId: string): string {
    // This is a simplified mapping - you might want to fetch actual category names
    const categoryMap: { [key: string]: string } = {
      '1': 'Electronics',
      '2': 'Fashion',
      '3': 'Home & Garden',
      '4': 'Sports',
      '5': 'Books',
      '6': 'Toys',
      // Add more mappings as needed
    };

    return categoryMap[categoryId] || 'General';
  }

  // Generate product image based on product name and index
  private generateProductImage(productName: string, index: number): string {
    const name = (productName || '').toLowerCase();

    // Product-specific images based on keywords
    if (name.includes('phone') || name.includes('mobile')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop';
    } else if (name.includes('laptop') || name.includes('computer')) {
      return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop';
    } else if (name.includes('tv') || name.includes('television')) {
      return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop';
    } else if (name.includes('headphone') || name.includes('earphone')) {
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop';
    } else if (name.includes('watch')) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop';
    } else if (name.includes('camera')) {
      return 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop';
    } else if (name.includes('tablet')) {
      return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop';
    } else if (name.includes('speaker')) {
      return 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop';
    } else if (name.includes('book')) {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop';
    } else if (name.includes('shoe') || name.includes('sneaker')) {
      return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop';
    } else if (name.includes('shirt') || name.includes('clothing')) {
      return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop';
    }

    // Fallback images array
    const fallbackImages = [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
    ];

    return fallbackImages[index % fallbackImages.length];
  }

  // Generate thumbnail
  private generateThumbnail(productName: string, index: number): string {
    return this.generateProductImage(productName, index).replace('w=800&h=600', 'w=150&h=150');
  }

  // Generate weight based on product name
  private generateWeight(productName: string): string {
    const name = (productName || '').toLowerCase();

    if (name.includes('phone') || name.includes('mobile')) {
      return '200 gram';
    } else if (name.includes('laptop')) {
      return '2 kg';
    } else if (name.includes('tv')) {
      return '15 kg';
    } else if (name.includes('book')) {
      return '300 gram';
    } else if (name.includes('headphone')) {
      return '250 gram';
    }

    return '500 gram';
  }

  // Generate tags based on product name
  private generateTags(productName: string): string[] {
    const name = (productName || '').toLowerCase();
    const tags: string[] = [];

    if (name.includes('phone') || name.includes('mobile')) {
      tags.push('Mobile', 'Communication', 'Smartphone');
    } else if (name.includes('laptop')) {
      tags.push('Computer', 'Laptop', 'Technology');
    } else if (name.includes('tv')) {
      tags.push('Television', 'Entertainment', 'Home Theater');
    }

    tags.push('New Arrival', 'Best Seller');
    return tags;
  }

  // Generate slug for SEO
  private generateSlug(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Generate warranty information
  private generateWarranty(productName: string): string {
    const name = (productName || '').toLowerCase();

    if (name.includes('phone') || name.includes('laptop')) {
      return '1 Year International Warranty';
    } else if (name.includes('tv')) {
      return '2 Year Manufacturer Warranty';
    }

    return '6 Month Warranty';
  }

  // Generate features based on product type
  private generateFeatures(productName: string): string[] {
    const name = (productName || '').toLowerCase();

    if (name.includes('phone')) {
      return [
        'High-resolution camera',
        'Fast charging',
        'Water resistant',
        'Face unlock',
        'Fingerprint sensor'
      ];
    } else if (name.includes('laptop')) {
      return [
        'Fast SSD storage',
        'HD webcam',
        'Backlit keyboard',
        'Long battery life',
        'Multiple ports'
      ];
    }

    return [
      'High quality materials',
      'Durable construction',
      'User-friendly design',
      'Great value for money'
    ];
  }

  // Enhanced description generator
  private generateDescription(productName: string): string {
    const name = (productName || '').toLowerCase();

    if (name.includes('phone')) {
      return 'Experience the latest in mobile technology with this premium smartphone. Featuring advanced camera capabilities, lightning-fast performance, and sleek design that fits perfectly in your hand.';
    } else if (name.includes('laptop')) {
      return 'Boost your productivity with this powerful laptop designed for modern professionals. Combining performance, portability, and style in one comprehensive package.';
    } else if (name.includes('tv')) {
      return 'Transform your living room into a home theater with this stunning television. Enjoy crystal-clear picture quality and immersive audio for the ultimate entertainment experience.';
    }

    return `Discover the perfect blend of quality, innovation, and value with ${productName}. Designed to exceed expectations and deliver exceptional performance.`;
  }

  // Generate badge for product
  private generateBadge(dbProduct: any): string {
    const badges = ['New Arrival', 'Best Seller', 'Hot Deal', 'Limited Edition', 'Featured'];

    // Logic for badge assignment
    if ((dbProduct.stockQuantity || 0) < 5) {
      return 'Limited Stock';
    } else if ((dbProduct.price || 0) > 1000) {
      return 'Premium';
    }

    return badges[Math.floor(Math.random() * badges.length)];
  }

  // Keep all existing methods...
  // (All the helper methods from your original service)

  // Method to get product by ID - Enhanced to work with database products
  getProductById(id: number): any {
    const homeProduct = this.products.find(product => product.id === id) || this.selectedProduct;

    if (!homeProduct) {
      return null;
    }

    return {
      ...homeProduct,
      // Ensure all required fields are present
      images: this.generateProductImages(homeProduct),
      specifications: this.generateSpecifications(homeProduct)
    };
  }

  // Helper method to generate random price if not available
  private generateRandomPrice(): number {
    return Math.floor(Math.random() * 500) + 50;
  }

  // Calculate original price (typically 15-30% higher than current price)
  private calculateOriginalPrice(currentPrice: number): number {
    if (!currentPrice) currentPrice = this.generateRandomPrice();
    const discountPercent = Math.floor(Math.random() * 15) + 15;
    return Math.floor(currentPrice * (100 + discountPercent) / 100);
  }

  // Calculate discount percentage
  private calculateDiscount(currentPrice: number, originalPrice: number): number {
    if (!currentPrice || !originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  // Generate random rating between 3.5-5.0
  private generateRandomRating(): number {
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
  }

  // Generate random review count
  private generateRandomReviewCount(): number {
    return Math.floor(Math.random() * 50) + 5;
  }

  // Extract brand from title
  private extractBrandFromTitle(title: string): string {
    const commonBrands = [
      'Samsung', 'Apple', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus',
      'Acer', 'Microsoft', 'Google', 'Amazon', 'Nike', 'Adidas', 'Canon',
      'Nikon', 'Bose', 'JBL', 'Beats', 'Fitbit', 'Garmin', 'Xiaomi', 'OnePlus'
    ];

    const titleWords = title.split(' ');

    for (const word of titleWords) {
      const brand = commonBrands.find(b => b.toLowerCase() === word.toLowerCase());
      if (brand) return brand;
    }

    return titleWords[0] || 'Premium Brand';
  }

  // Extract model from title
  private extractModelFromTitle(title: string): string {
    const modelPatterns = [
      /([A-Z]\d+[A-Z]*)/i,
      /(\d+[A-Z]+)/i,
      /(Pro|Max|Plus|Mini|Ultra)/i,
      /(\d{4})/,
      /([A-Z]{2,}\d+)/i
    ];

    for (const pattern of modelPatterns) {
      const match = title.match(pattern);
      if (match) return match[1];
    }

    return 'Standard';
  }

  // Generate product images
  private generateProductImages(homeProduct: any): Array<{ itemImageSrc: string, thumbnailImageSrc: string, alt: string }> {
    const mainImage = homeProduct.imgSrc || this.getDefaultImage();
    const title = homeProduct.title || homeProduct.name || 'Product';

    const imageVariations = [
      mainImage,
      this.getAlternativeImage(1, homeProduct),
      this.getAlternativeImage(2, homeProduct),
      this.getAlternativeImage(3, homeProduct)
    ];

    return imageVariations.map((image, index) => ({
      itemImageSrc: image,
      thumbnailImageSrc: this.generateThumbnailFromUrl(image),
      alt: `${title} - ${this.getImageAltText(index)}`
    }));
  }

  private getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop';
  }

  private getAlternativeImage(index: number, homeProduct: any): string {
    const baseImages = [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop'
    ];
    return baseImages[index % baseImages.length];
  }

  private generateThumbnailFromUrl(imageUrl: string): string {
    return imageUrl.replace('w=800&h=600', 'w=150&h=150');
  }

  private getImageAltText(index: number): string {
    const altTexts = ['Main View', 'Side View', 'Detail View', 'Additional View'];
    return altTexts[index] || `View ${index + 1}`;
  }

  // Generate specifications
  private generateSpecifications(homeProduct: any): { [key: string]: string } {
    return {
      'Brand': homeProduct.brand || 'Premium Brand',
      'Model': homeProduct.model || 'Latest',
      'Dimensions': homeProduct.dimensions ?
        `${homeProduct.length} x ${homeProduct.width} x ${homeProduct.height} cm` :
        'Compact Design',
      'Weight': homeProduct.weight || 'Lightweight',
      'Warranty': homeProduct.warranty || '1 Year',
      'Color': 'Multiple Options Available'
    };
  }


  // Toggle between database and hardcoded data
  public toggleDataSource(useDatabase: boolean = true): void {
    this.useDatabase = useDatabase;
  }

  // Method to refresh products from database
  public refreshProducts(): Observable<any> {
    this.products = [];
    return this.getBlog();
  }

  // Keep all other existing methods unchanged...
  mapToProductDetail(homeProduct: any): any {
    return this.getProductById(homeProduct.id);
  }

  clearSelectedProduct(): void {
    this.selectedProduct = null;
    this.detailId = '';
  }

  getRelatedProducts(currentProductId: number, limit: number = 4): any[] {
    return this.products
      .filter(product => product.id !== currentProductId)
      .slice(0, limit)
      .map(product => ({
        id: product.id,
        name: product.title || product.name || 'Product Name',
        price: product.price || this.generateRandomPrice(),
        originalPrice: product.originalPrice || this.calculateOriginalPrice(product.price),
        image: product.imgSrc || this.getDefaultImage(),
        rating: product.rating || this.generateRandomRating(),
        reviewCount: this.generateRandomReviewCount(),
        badge: this.generateBadge(product)
      }));
  }

  searchProducts(query: string): any[] {
    if (!query) return this.products;

    const searchTerm = query.toLowerCase();
    return this.products.filter(product =>
      (product.title || '').toLowerCase().includes(searchTerm) ||
      (product.category || '').toLowerCase().includes(searchTerm) ||
      (product.description || '').toLowerCase().includes(searchTerm)
    );
  }

  getProductsByCategory(category: string): any[] {
    return this.products.filter(product =>
      (product.category || '').toLowerCase() === category.toLowerCase()
    );
  }

  getFeaturedProducts(limit: number = 6): any[] {
    return this.products
      .filter(product => product.featuredPost)
      .slice(0, limit);
  }

  getSaleProducts(limit: number = 6): any[] {
    return this.products
      .filter(product => product.originalPrice && product.price < product.originalPrice)
      .slice(0, limit);
  }
  getAllProductsWithFilter(category?: string): Observable<any> {
    if (category) {
      return this.getBlog().pipe(
        map(products => products.filter((product: { categoryId: { toString: () => any; }; category_id: { toString: () => any; }; category: any; categoryName: any; }) => {
          // Filter by category ID
          const productCategoryId = product.categoryId?.toString() || product.category_id?.toString();
          if (productCategoryId === category) {
            return true;
          }

          // Filter by category name
          const productCategoryName = (product.category || product.categoryName || '').toString().toLowerCase();
          if (productCategoryName === category.toLowerCase()) {
            return true;
          }

          return false;
        }))
      );
    }

    return this.getBlog();
  }
}