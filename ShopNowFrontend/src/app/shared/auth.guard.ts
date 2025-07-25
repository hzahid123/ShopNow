import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

export const authGuard: CanActivateFn = () => {
  const oauthService = inject(OAuthService);
  const router = inject(Router);
  const token = sessionStorage.getItem('accessToken');

  if (token) {
    return true;
  } else {
    router.navigate(['/authentication']); // Redirect to your login page
    return false;
  }
};
