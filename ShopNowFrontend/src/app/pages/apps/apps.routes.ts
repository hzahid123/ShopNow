import { Routes } from '@angular/router';
import { ManageStoresComponent } from './manage-stores/manage-stores.component';
import { ManageStoresRequestsComponent } from './manage-stores-requests/manage-stores-requests.component';
import { AppErrorComponent } from '../authentication/error/error.component';
import { ManageProdcutsComponent } from './manage-prodcuts/manage-prodcuts.component';
import { ManageProductCategoriesComponent } from './manage-product-categories/manage-product-categories.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManagePaymentsComponent } from './manage-payments/manage-payments.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { ManageUsersComponent } from './manage-users1/manage-users/manage-users.component';
import { ManageUserRolesComponent } from './manage-user-roles/manage-user-roles/manage-user-roles.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { AllStoresComponent } from './manage-stores/all-stores/all-stores.component';
import { FollowedStoresComponent } from './manage-stores/followed-stores/followed-stores.component';
import { FAQsComponent } from './support/faqs/faqs.component';
import { PaymentComponent } from './payment/payment.component';
import { ProductCategorywiseComponent } from './product-categorywise/product-categorywise.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ReturnsRefundsComponent } from './returns-refunds/returns-refunds.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { SettingsComponent } from './settings/settings.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ActivateEmailComponent } from './activate-email/activate-email.component';
import { UpdateEmailComponent } from '../authentication/update-email/update-email.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UploadPictureComponent } from './settings/upload-picture/upload-picture.component';
import { EditProfileComponent } from './settings/edit-profile/edit-profile.component';
import { OverviewComponent } from './apps/overview/overview.component';
import { ContactComponent } from './support/contact/contact.component';
import { PolicyComponent } from './support/policy/policy.component';

export const AppsRoutes: Routes = [
  {
    path: '',
    children: [

      // manage-users1
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        data: {
          title: 'Manage Users',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Manage Users' },
          ],
        },
      },
      // overviewn
        {
        path: 'overview',
        component: OverviewComponent,
        data: {
          title: 'Overview',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Overview' },
          ],
        },
      },


      // manage-users-roles
      {
        path: 'manage-users-roles',
        component: ManageUserRolesComponent,
        data: {
          title: 'Manage Users Roles',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Manage Users Roles' },
          ],
        },
      },

      // home page pages
      {
        path: 'home',
        component: HomePageComponent,
        data: {
          title: 'Home',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Home' },
          ],
        },
      },

      {
        path: 'product-detail',
        component: ProductDetailComponent,
        data: {
          title: 'Product Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Product Detail' },
          ],
        },
      },

      {
        path: 'product-detail/:id',
        component: ProductDetailComponent,
        data: {
          title: 'Product Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Product Detail' },
          ],
        },
      },

      // ========== CART ROUTES ==========
      {
        path: 'add-to-cart',
        component: AddToCartComponent,
        data: {
          title: 'Add To Cart',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Add To Cart' },
          ],
        },
      },

      // Main cart page - shows all items in cart
      {
        path: 'cart',
        component: AddToCartComponent,
        data: {
          title: 'Shopping Cart',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Shopping Cart' },
          ],
        },
      },

      // CHECKOUT ROUTES
      {
        path: 'checkout',
        component: CheckoutComponent,
        data: {
          title: 'Checkout',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Shopping Cart ', url: '/apps/cart' },
            { title: 'Checkout' },
          ],
        },
      },

      {
        path: 'checkout/shipping',
        component: CheckoutComponent,
        data: {
          title: 'Shipping Information',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Checkout', url: '/apps/checkout' },
            { title: 'Shipping' },
          ],
        },
      },

      {
        path: 'checkout/payment',
        component: CheckoutComponent,
        data: {
          title: 'Payment Information',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Checkout', url: '/apps/checkout' },
            { title: 'Payment' },
          ],
        },
      },

      {
        path: 'checkout/review',
        component: CheckoutComponent,
        data: {
          title: 'Order Review',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Checkout', url: '/apps/checkout' },
            { title: 'Review Order' },
          ],
        },
      },

      // ========== CATEGORY ROUTES (UPDATED) ==========
      
      // Route with both ID and slug parameters
      {
        path: 'product-categorywise/:id/:slug',
        component: ProductCategorywiseComponent,
        data: {
          title: 'Products by Category',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Products by Category' },
          ],
        },
      },

      // Route with only slug parameter (for SEO-friendly URLs)
      {
        path: 'category/:slug',
        component: ProductCategorywiseComponent,
        data: {
          title: 'Category Products',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Category Products' },
          ],
        },
      },

      // Route with only ID parameter (for backward compatibility)
      {
        path: 'product-categorywise/:id',
        component: ProductCategorywiseComponent,
        data: {
          title: 'Products by Category',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Products by Category' },
          ],
        },
      },

      // Base route without parameters (for category selection page)
      {
        path: 'product-categorywise',
        component: ProductCategorywiseComponent,
        data: {
          title: 'Products Categories',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Products Categories' },
          ],
        },
      },

      // ========== END CATEGORY ROUTES ==========

      // Order confirmation
      {
        path: 'order-confirmation',
        component: AddToCartComponent,
        data: {
          title: 'Order Confirmation',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Order Confirmation' },
          ],
        },
      },

      {
        path: 'order-confirmation/:orderId',
        component: AddToCartComponent,
        data: {
          title: 'Order Confirmation',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Order Confirmation' },
          ],
        },
      },

      // Wishlist routes
      {
        path: 'wishlist',
        component: WishlistComponent,
        data: {
          title: 'My Wishlist',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Wishlist', url: '/apps/wishlist' }
          ],
        },
      },

      // View Orders
      {
        path: 'view-orders',
        component: ViewOrdersComponent,
        data: {
          title: 'View Orders',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'View Order', url: '/apps/view-orders' },
          ],
        },
      },

      // Settings route with child routes
      {
        path: 'settings',
        data: {
          title: 'Settings',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Settings', url: '/apps/settings' },
          ],
        },
        children: [
          {
            path: '',
            component: SettingsComponent,
          },
          {
            path: 'upload',
            component: UploadPictureComponent,
            data: {
              title: 'Upload Picture',
              urls: [
                { title: 'Dashboard', url: '/dashboards/dashboard1' },
                { title: 'Settings', url: '/apps/settings' },
                { title: 'Upload Picture', url: '/apps/settings/upload' },
              ],
            },
          },
          {
            path: 'edit',
            component: EditProfileComponent,
            data: {
              title: 'Edit Profile',
              urls: [
                { title: 'Dashboard', url: '/dashboards/dashboard1' },
                { title: 'Settings', url: '/apps/settings' },
                { title: 'Edit Profile', url: '/apps/settings/edit' },
              ],
            },
          },
        ],
      },

      // Cart management for specific products
      {
        path: 'cart/add/:productId',
        component: AddToCartComponent,
        data: {
          title: 'Add To Cart',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Add To Cart' },
          ],
        },
      },

      // Quick buy route
      {
        path: 'quick-buy/:productId',
        component: AddToCartComponent,
        data: {
          title: 'Quick Buy',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Quick Buy' },
          ],
        },
      },

      // ========== END CART ROUTES ==========

      // manage-payments
      {
        path: 'manage-payments',
        component: ManagePaymentsComponent,
        data: {
          title: 'Manage Payments',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Manage Payements' },
          ],
        },
      },

      // manage-orders
      {
        path: 'manage-orders',
        component: ManageOrdersComponent,
        data: {
          title: 'Manage Orders',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Manage Orders' },
          ],
        },
      },

      // manage-products-categories
      {
        path: 'manage-products-categories',
        component: ManageProductCategoriesComponent,
        data: {
          title: 'Manage Products Categories',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Manage Products Categories' },
          ],
        },
      },

      // manage products
      {
        path: 'products/manage-prodcuts',
        component: ManageProdcutsComponent,
        data: {
          title: 'Manage Products',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Manage Products' },
          ],
        },
      },

      {
        path: 'error',
        component: AppErrorComponent,
      },

      // ========== STORE ROUTES ==========
      {
        path: 'stores/manage-stores',
        component: ManageStoresComponent,
        data: {
          title: 'Manage Stores',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Manage Stores' },
          ],
        },
      },

      {
        path: 'stores/all-stores',
        component: AllStoresComponent,
        data: {
          title: 'All Stores',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'All Stores' },
          ],
        },
      },

      {
        path: 'stores/followed-stores',
        component: FollowedStoresComponent,
        data: {
          title: 'Followed Stores',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Followed Stores' },
          ],
        },
      },

      {
        path: 'stores/manage-stores-requests',
        component: ManageStoresRequestsComponent,
        data: {
          title: 'Manage Stores Requests',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Manage Stores Requests' },
          ],
        },
      },

      // ========== SUPPORT ROUTES ==========
      {
        path: 'support/FAQs',
        component: FAQsComponent,
        data: {
          title: 'FAQs-Frequently Asked Questions',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'FAQs-Frequently Asked Questions' },
          ],
        },
      },
      {
        path: 'support/contact',
        component: ContactComponent,
        data: {
          title: 'Contact Us',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: ' Contact Us' },
          ],
        },
      },
      {
        path: 'support/policy',
        component: PolicyComponent,
        data: {
          title: 'Privay Policy',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Privay Policy' },
          ],
        },
      },

      

      // ========== OTHER ROUTES ==========
      {
        path: 'sales-dashboard',
        component: SalesDashboardComponent,
        data: {
          title: 'Sales Dashboard',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sales Dashboard' },
          ],
        },
      },

      {
        path: 'returns-refunds',
        component: ReturnsRefundsComponent,
        data: {
          title: 'Returns/Refunds',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Return/Refunds' },
          ],
        },
      },

      {
        path: 'payment',
        component: PaymentComponent,
        data: {
          title: 'Payment',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'payment' },
          ],
        },
      },

      {
        path: 'feedback',
        component: FeedbackComponent,
        data: {
          title: 'Feedback',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'feedback' },
          ],
        },
      },

      {
        path: 'activate-email',
        component: ActivateEmailComponent,
        data: {
          title: 'Activate Email',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'activate-email' },
          ],
        },
      },

      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        data: {
          title: 'Admin Dashboard',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Admin Dashboard' },
          ],
        },
      },
    ],
  },
];