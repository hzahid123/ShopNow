export interface AppSettings {
  dir: 'ltr' | 'rtl';
  theme: string;
  sidenavOpened: boolean;
  sidenavCollapsed: boolean;
  boxed: boolean;
  horizontal: boolean;
  activeTheme: string;
  language: string;
  cardBorder: boolean;
  navPos: 'side' | 'top';
}

export const defaults: AppSettings = {
  dir: 'ltr',
  theme: 'light',
  sidenavOpened: false,
  sidenavCollapsed: false,
  boxed: false,
  horizontal: false,
  cardBorder: false,
  activeTheme: 'green_theme',
  language: 'en-us',
  navPos: 'side',
};

export const legaldefaults: AppSettings = {
  dir: 'ltr',
  theme: 'light',
  sidenavOpened: false,
  sidenavCollapsed: false,
  boxed: false,
  horizontal: false,
  cardBorder: false,
  activeTheme: 'legal_theme',
  language: 'en-us',
  navPos: 'side',
};