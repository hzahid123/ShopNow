import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  signal,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef
} from '@angular/core';
import { CoreService } from '../../../../services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { navItems } from '../sidebar/sidebar-data';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AppBreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { MaterialModule } from 'src/app/material.module';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeServiceService } from '../../shared/theme-service.service';
import { CartService, CartItem } from '../../../../pages/apps/add-to-cart/add-to-cart.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { BrandingComponent } from '../../vertical/sidebar/branding.component';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../../services/api.service';

// Interfaces for category structure
interface Category {
  id: string;
  name: string;
  icon?: string;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  subSubCategories?: SubSubCategory[];
}

interface SubSubCategory {
  id: string;
  name: string;
  subCategoryId: string;
}

interface notifications {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    BrandingComponent,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    AppBreadcrumbComponent,
    MatChipsModule
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() optionsChange = new EventEmitter<AppSettings>();
  hideSingleSelectionIndicator = signal(true);
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<boolean>();

  darkmode!: boolean;
  showFiller = false;

  // FIXED: Cart properties with proper initialization
  cartItemsCount: number = 0;
  cartItems: CartItem[] = [];
  cartTotal: number = 0;

  isCategoryMenuOpen = false;

  // Category related properties
  selectedCategory: string = '';
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchKeyword: string = '';
  isSearching = false;

  // Search state
  searchText: string = '';
  showSearchResults = false;

  // Hover states for nested menus
  hoveredCategory: Category | null = null;
  hoveredSubCategory: SubCategory | null = null;

  // View mode
  viewMode: string = 'grid';

  userFullName: string = '';
  userEmail: string = '';

  // Subject for managing subscriptions
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: '/assets/images/flag/icon-flag-en.svg',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/assets/images/flag/icon-flag-en.svg',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: '/assets/images/flag/icon-flag-fr.svg',
    }
  ];

  constructor(
    private settings: CoreService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private themeService: ThemeServiceService,
    private router: Router,
    private cartService: CartService,
    private apiService: ApiService,
    private elementRef: ElementRef
  ) {
    translate.setDefaultLang('en');
  }

  options = this.settings.getOptions();

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.cartItems = items;
        this.cartItemsCount = this.cartService.getCartItemCount(); // Use service logic
        this.cartTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      });
    this.cartService.cartSummary$
      .pipe(takeUntil(this.destroy$))
      .subscribe(summary => {
        this.cartItemsCount = summary.totalItems ?? 0;
      });


    this.loadCategories();
    this.setupSearchDebouncing();

     // ✅ User Info - Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', user);

    // Set user display information
    this.userFullName = user.fullName || `${user.name} ${user.surname}`;
    this.userEmail = user.emailAddress || '';

    // Check if user is authenticated
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['authentication/authentication/login']);
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // FIXED: Initialize cart data on component load
  private initializeCart(): void {
    try {
      // Get current cart items synchronously
      const currentItems = this.cartService.getCartItems();
      console.log('Initial cart items:', currentItems); // Debug log

      this.cartItems = currentItems;
      this.updateCartData(currentItems);
    } catch (error) {
      console.error('Error initializing cart:', error);
      this.cartItems = [];
      this.cartItemsCount = 0;
      this.cartTotal = 0;
    }
  }

  // FIXED: Update cart data method
  private updateCartData(items: CartItem[]): void {
    try {
      // Calculate total quantity
      this.cartItemsCount = items.reduce((total, item) => {
        return total + (item.quantity || 0);
      }, 0);

      // Calculate total price
      this.cartTotal = items.reduce((total, item) => {
        return total + ((item.price || 0) * (item.quantity || 0));
      }, 0);

      console.log('Cart updated - Items:', this.cartItemsCount, 'Total:', this.cartTotal); // Debug log
    } catch (error) {
      console.error('Error updating cart data:', error);
      this.cartItemsCount = 0;
      this.cartTotal = 0;
    }
  }

  // FIXED: Cart getter methods
  getCartItemsCount(): number {
    return this.cartItemsCount;
  }

  getCartSummary(): any {
    return {
      total: this.cartTotal.toFixed(2),
      itemCount: this.cartItemsCount,
      items: this.cartItems
    };
  }

  isCartEmpty(): boolean {
    return this.cartItemsCount === 0;
  }

  // FIXED: Cart tooltip getter
  getCartTooltip(): string {
    if (this.isCartEmpty()) {
      return 'Cart is empty';
    }
    return `Cart (${this.cartItemsCount} items) - Total: $${this.cartTotal.toFixed(2)}`;
  }

  // FIXED: Cart click handler
  onCartClick(): void {
    console.log('Cart clicked - Items:', this.cartItemsCount); // Debug log
    this.router.navigate(['/apps/cart']);
  }

  // FIXED: Method to manually refresh cart (for debugging)
  refreshCart(): void {
    this.initializeCart();
  }

  trackByCategoryId(index: number, category: any): string {
    return category.id;
  }


  // Load categories from API
  loadCategories(keyword?: string): void {
    this.isSearching = true;
    this.apiService.getCategoriesWithSubCategories(keyword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.filteredCategories = categories;
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.isSearching = false;
        }
      });
  }

  // Setup search debouncing
  setupSearchDebouncing(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchKeyword = searchTerm;
      this.loadCategories(searchTerm);
    });
  }

  // Handle search input
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;
    this.showSearchResults = this.searchText.length > 0;
    this.searchSubject.next(this.searchText);
  }

  // Handle category selection
  onCategoryChange(event: any): void {
    const selectedCategoryId = event.value;
    console.log('Selected category:', selectedCategoryId);

    // Find the selected category
    const category = this.categories.find(cat => cat.id === selectedCategoryId);
    if (category) {
      console.log('Selected category details:', category);
      // Close dropdown after selection
      this.closeCategoryMenu();
      // Navigate to products
      this.router.navigate(['/apps/category', selectedCategoryId], {
        queryParams: { category: selectedCategoryId }
      });
    }
  }

  // Handle subcategory selection
  onSubCategorySelect(subCategory: SubCategory): void {
    console.log('Selected subcategory:', subCategory);
    this.closeCategoryMenu();
    this.router.navigate(['/products'], {
      queryParams: {
        category: subCategory.categoryId,
        subCategory: subCategory.id
      }
    });
    this.clearSearch();
  }

  // Handle sub-subcategory selection
  onSubSubCategorySelect(subSubCategory: SubSubCategory): void {
    console.log('Selected sub-subcategory:', subSubCategory);
    this.closeCategoryMenu();
    this.router.navigate(['/products'], {
      queryParams: {
        subSubCategory: subSubCategory.id
      }
    });
    this.clearSearch();
  }


logout() {
    // Remove the token
    sessionStorage.removeItem('accessToken');

    // (optional) remove user data
    localStorage.removeItem('user');

    console.log('Access token removed. Logging out...');

    // Navigate to login page
    this.router.navigate(['authentication/authentication/login']);
  }

  // Profile menu items configuration
  profileMenuItems: any[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'My Profile',
      subtitle: 'Account Settings',
      link: '/apps/settings', // Updated link
    }
  ];
  



  // Handle category hover for showing subcategories
  onCategoryHover(category: Category): void {
    this.hoveredCategory = category;
    this.hoveredSubCategory = null;
  }

  // Handle subcategory hover for showing sub-subcategories
  onSubCategoryHover(subCategory: SubCategory): void {
    this.hoveredSubCategory = subCategory;
  }

  // Clear hover states
  clearHoverStates(): void {
    this.hoveredCategory = null;
    this.hoveredSubCategory = null;
  }

  // Toggle menu method
  togglemenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isCategoryMenuOpen = !this.isCategoryMenuOpen;

    if (this.isCategoryMenuOpen) {
      this.clearHoverStates();
    }
  }

  // Close category menu method
  closeCategoryMenu(): void {
    this.isCategoryMenuOpen = false;
    this.clearHoverStates();
  }

  // Document click handler
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if click is inside the category dropdown container
    const categoryDropdown = this.elementRef.nativeElement.querySelector('.category-hover-dropdown');
    const categoryToggle = this.elementRef.nativeElement.querySelector('.category-toggle-btn');

    // If click is outside both the dropdown and toggle button, close the menu
    if (categoryDropdown && categoryToggle) {
      const clickedInDropdown = categoryDropdown.contains(target);
      const clickedOnToggle = categoryToggle.contains(target);

      if (!clickedInDropdown && !clickedOnToggle) {
        this.closeCategoryMenu();
      }
    }
  }

  // Handle escape key to close dropdown
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isCategoryMenuOpen) {
      this.closeCategoryMenu();
    }
  }

  // Clear search
  clearSearch(): void {
    this.searchText = '';
    this.showSearchResults = false;
    this.searchKeyword = '';
    this.clearHoverStates();
  }

  // Reset filters
  resetFilters(): void {
    this.selectedCategory = '';
    this.clearSearch();
    this.loadCategories();
  }

  // Theme methods
  setDark(): void {
    this.optionsChange.emit(this.options);
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark');
    this.darkmode = !this.darkmode;

    if (this.darkmode) {
      localStorage.setItem('darkmode', 'dark');
      this.themeService.switchTheme('lara-dark-blue');
      this.options.theme = 'dark';
    } else {
      localStorage.setItem('darkmode', 'white');
      this.themeService.switchTheme('lara-light-blue');
      this.options.theme = 'light';
    }

    this.buttonClick.emit(this.darkmode);
    setTimeout(() => {
      this.setDark();
    }, 1);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AppSearchDialogComponent, {
      data: {
        categories: this.categories,
        searchKeyword: this.searchKeyword
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Search dialog result:', result);
        if (result.type === 'category') {
          this.onCategoryChange({ value: result.id });
        } else if (result.type === 'subCategory') {
          this.onSubCategorySelect(result);
        } else if (result.type === 'subSubCategory') {
          this.onSubSubCategorySelect(result);
        }
      }
    });
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  // Static data (keep existing)
  notifications: notifications[] = [
    {
      id: 1,
      img: '/assets/images/profile/user-1.jpg',
      title: 'Roman Joined thes Team!',
      subtitle: 'Congratulate him',
    },
    {
      id: 2,
      img: '/assets/images/profile/user-2.jpg',
      title: 'New message received',
      subtitle: 'Salma sent you new message',
    }
  ];

  profiledd: profiledd[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'My Profile',
      subtitle: 'Account Settings',
      link: '/',
    }
  ];

  apps: apps[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-dd-chat.svg',
      title: 'Chat Application',
      subtitle: 'Messages & Emails',
      link: '/apps/chat',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-dd-cart.svg',
      title: 'Todo App',
      subtitle: 'Completed task',
      link: '/apps/todo',
    }
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Pricing Page',
      link: '/theme-pages/pricing',
    },
    {
      id: 3,
      title: 'Register Now',
      link: '/authentication/side-register',
    },
    {
      id: 4,
      title: '404 Error Page',
      link: '/authentication/error',
    }
  ];
}

// Keep the existing AppSearchDialogComponent as is...
@Component({
  selector: 'search-dialog',
  standalone: true,
  imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule, CommonModule],
  templateUrl: 'search-dialog.component.html',
})
export class AppSearchDialogComponent implements OnInit, OnDestroy {
  searchText: string = '';
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  navItems = navItems;
  navItemsData = navItems.filter((navitem) => navitem.displayName);

  // Hover states
  hoveredCategory: Category | null = null;
  hoveredSubCategory: SubCategory | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  cartService: any;

  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialog
  ) { }

  ngOnInit(): void {
    this.setupSearchDebouncing();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearchDebouncing(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.loadCategories(searchTerm);
    });
  }

  loadCategories(keyword?: string): void {
    this.apiService.getCategoriesWithSubCategories(keyword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.filteredCategories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;
    this.searchSubject.next(this.searchText);
  }

  onCategoryHover(category: Category): void {
    this.hoveredCategory = category;
    this.hoveredSubCategory = null;
  }

  onSubCategoryHover(subCategory: SubCategory): void {
    this.hoveredSubCategory = subCategory;
  }

  clearHoverStates(): void {
    this.hoveredCategory = null;
    this.hoveredSubCategory = null;
  }

  selectCategory(category: Category): void {
    this.dialogRef.closeAll();
    // Return result to parent component
    this.dialogRef.afterAllClosed.subscribe(() => {
      // Handle category selection
    });
  }

  selectSubCategory(subCategory: SubCategory): void {
    this.dialogRef.closeAll();
    // Return result to parent component
  }

  selectSubSubCategory(subSubCategory: SubSubCategory): void {
    this.dialogRef.closeAll();
    // Return result to parent component
  }




}