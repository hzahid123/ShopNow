import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Sale Reports',
  },
  {
    displayName: 'Manage Sale Reports',
    iconName: 'layout-dashboard',
    route: '/dashboards/dashboard1',
  },
  {
    displayName: 'Admin Dashboard',
    iconName: 'category',
    route: '/apps/admin-dashboard',
  },
  {
    navCap: 'Home',
  },
  {
    displayName: 'Home Page',
    iconName: 'home',
    route: '/apps/home',
  },
  //overview
    {
  displayName: 'Overview',
  iconName: 'category',
  route: '/apps/overview'
},
  {
    displayName: 'Wish List',
    iconName: 'heart',
    route: '/apps/wishlist',
  },
   {
    displayName: 'Returns and Refunds',
    iconName: 'credit-card-refund',
    route: '/apps/returns-refunds',
  },
   {
    displayName: 'Payment',
    iconName: 'wallet',
    route: '/apps/payment',
  },
   {
    displayName: 'Feedback',
    iconName: 'message-dots',
    route: '/apps/feedback',
  },

  {
    navCap: 'Seller Dashboard',
  },
  {
    displayName: 'Sales Dashboard',
    iconName: 'category',
    route: '/apps/sales-dashboard',
  },
  
  
  // manage users

  {
    navCap: 'Users',
  },
  {
    displayName: 'Manage Users',
    iconName: 'user-circle',
    route: 'apps/manage-users',
  },

  {
    displayName: 'Manage User Roles',
    iconName: 'users-group',
    route: 'apps/manage-users-roles',
  },

  {
    navCap: 'Products',
  },
  {
    displayName: 'Manage Products',
    iconName: 'package',
    route: 'apps/products/manage-prodcuts',
  },

  {
    displayName: 'Manage Product Categories',
    iconName: 'category',
    route: 'apps/manage-products-categories',
  },
  //manage stores
  {
    navCap: 'Stores',
  },
  {
    displayName: 'Manage',
    iconName: 'settings', // More general management icon
    children: [
      {
        displayName: 'Stores',
        iconName: 'building-store', // Icon for physical store
        route: 'apps/stores/manage-stores',
      },
      {
        displayName: 'Stores Requests',
        iconName: 'mail-forward', // Icon indicating incoming requests
        route: 'apps/stores/manage-stores-requests',
      },
    ],
  },
  {
    displayName: 'Display',
    iconName: 'eye', // Indicates display/view
    children: [
      {
        displayName: 'All Stores',
        iconName: 'building-store', // Reuse since it's a store list
        route: 'apps/stores/all-stores',
      },
      {
        displayName: 'Followed Stores',
        iconName: 'user-heart', // Represents following or favoriting
        route: 'apps/stores/followed-stores',
      },
    ],
  }
  ,
  // manage orders
  {
    navCap: 'Orders',
  },
  {
    displayName: 'Manage Orders',
    iconName: 'truck-delivery',
    route: 'apps/manage-orders',
  },
  
  //View Orders
  {
    displayName: 'View Orders',
    iconName: 'list',
    route: 'apps/view-orders',
  },

  // manage payments
  {
    navCap: 'Payments',
  },
  {
    displayName: 'Manage Payments',
    iconName: 'cash',
    route: 'apps/manage-payments',
  },

  // support
  {
    navCap: 'Support',
  },
  {
    displayName: 'FAQs',
    iconName: 'user',
    route: 'apps/support/FAQs',
  },
  {
  displayName: 'Contact Us',
  iconName: 'phone', // You can change this icon to something appropriate
  route: 'apps/support/contact',
  },
   {
  displayName: 'Privacy Policy',
  iconName: 'lock', // You can change this icon to something appropriate
  route: 'apps/support/policy',
  },

  {
    navCap: 'Sign In',
  },
  {
    displayName: 'Sign In',
    iconName: 'user',
    route: '/authentication/authentication/login',
  },
  {
    displayName: 'Sign Up as a seller',
    iconName: 'user',
    route: '/authentication/authentication/loginSeller',
  },

  {
    displayName: 'Settings',
    iconName: 'settings',
    route: '/apps/settings',
  }
];
