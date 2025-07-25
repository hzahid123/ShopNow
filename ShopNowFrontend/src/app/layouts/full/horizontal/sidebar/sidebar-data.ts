import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboards',
    iconName: 'home',
    route: 'dashboards',
    children: [
      {
        displayName: 'Clientfront',
        iconName: 'point',
        route: 'dashboards/dashboard1',
      },
      {
        displayName: 'eCommerce',
        iconName: 'point',
        route: 'dashboards/dashboard2',
      },
    ],
  },
  {
    displayName: 'Apps',
    iconName: 'apps',
    route: 'apps',
    ddType: '',
    children: [
      {
        displayName: 'ToDo',
        iconName: 'point',
        route: 'apps/todo',
      },
      {
        displayName: 'Blog',
        iconName: 'point',
        route: 'apps/blog',
        children: [
          {
            displayName: 'Post',
            iconName: 'point',
            route: 'apps/blog/post',
          },
          {
            displayName: 'Detail',
            iconName: 'point',
            route: 'apps/blog/detail/Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
          },
        ],
      },
    ],
  }
];
