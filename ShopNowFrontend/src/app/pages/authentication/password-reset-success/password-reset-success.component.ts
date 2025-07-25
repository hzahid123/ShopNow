
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-success',
  standalone: true,
  imports: [],
  templateUrl: './password-reset-success.component.html',
  styleUrl: './password-reset-success.component.scss'
})
export class PasswordResetSuccessComponent {
  
  constructor(private router: Router) {}

  navigateToLogin(): void {
    // Navigate to login page - adjust the route as needed for your app
    this.router.navigate(['/authentication/authentication/login']);
  }
}
