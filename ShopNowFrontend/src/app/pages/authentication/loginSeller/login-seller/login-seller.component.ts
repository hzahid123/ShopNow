import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-login-seller',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-seller.component.html',
  styleUrl: './login-seller.component.scss'
})
export class LoginSellerComponent implements OnInit {

  options = this.settings.getOptions();
  loginForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private settings: CoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      storeName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9\s\-_&.]+$/) // Allow letters, numbers, spaces, hyphens, underscores, ampersands, dots
      ]],
      ownerEmailOrUserName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        this.emailOrUsernameValidator
      ]],
      ownerName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z\s]+$/) // Only letters and spaces
      ]],
      ownerSurname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z\s]+$/) // Only letters and spaces
      ]]
    });
  }

  // Custom validator for email or username
  emailOrUsernameValidator(control: any) {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const value = control.value.trim();
    
    // Check if it contains spaces (not allowed)
    if (value.includes(' ')) {
      return { hasSpaces: true };
    }

    // Check if it's an email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmail = emailPattern.test(value);

    // Check if it's a valid username format (alphanumeric, underscore, hyphen, dot)
    const usernamePattern = /^[a-zA-Z0-9._-]+$/;
    const isValidUsername = usernamePattern.test(value);

    if (!isEmail && !isValidUsername) {
      return { invalidFormat: true };
    }

    return null;
  }

  // Getter methods for easy access to form controls in template
  get storeName() { return this.loginForm.get('storeName'); }
  get ownerEmailOrUserName() { return this.loginForm.get('ownerEmailOrUserName'); }
  get ownerName() { return this.loginForm.get('ownerName'); }
  get ownerSurname() { return this.loginForm.get('ownerSurname'); }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      this.loading = true;
      
      // Prepare payload for API
      const payload = {
        storeName: this.storeName?.value.trim(),
        ownerEmail: this.ownerEmailOrUserName?.value.trim(),
        ownerName: this.ownerName?.value.trim(),
        ownerSurname: this.ownerSurname?.value.trim()
      };

      console.log('Sending payload:', payload);

      // API call to create store request
      this.createStoreRequest(payload);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  async createStoreRequest(payload: any): Promise<void> {
    try {
      
      // Using ApiService if it has a generic post method
      const response = await firstValueFrom(
        this.apiService.createStoreRequest(payload)
      );
      this.loading = false;
      console.log('Store request created successfully:', response);

      // Handle success response
      this.handleCreateSuccess(response);

    } catch (error: any) {
      this.loading = false;
      console.error('Error creating store request:', error);
      
      // Handle error response
      this.handleCreateError(error);
    }
  }

  private handleCreateSuccess(response: any): void {
    // Show success message (you might want to use a toast service)
    alert('Store request submitted successfully!');
    
    // Reset form or navigate to success page
    this.loginForm.reset();
    this.submitted = false;
    
    // Optionally navigate to another page
    // this.router.navigate(['/dashboard']);
    // or
    // this.router.navigate(['/authentication/success']);
  }

  private handleCreateError(error: any): void {
    let errorMessage = 'An error occurred while submitting your request.';
    
    // Handle different types of errors
    if (error.status === 400) {
      errorMessage = 'Invalid data submitted. Please check your information.';
    } else if (error.status === 409) {
      errorMessage = 'A store with this information already exists.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    // Show error message (you might want to use a toast service)
    alert(errorMessage);
  }

  // Helper method to check if field has error and is touched/submitted
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.loginForm.get(fieldName);
    if (!field) return false;

    const hasError = errorType ? field.hasError(errorType) : field.invalid;
    return hasError && (field.touched || this.submitted);
  }

  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !this.hasError(fieldName)) return '';

    if (field.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required.`;
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `${this.getFieldDisplayName(fieldName)} must be at least ${minLength} characters long.`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return `${this.getFieldDisplayName(fieldName)} cannot exceed ${maxLength} characters.`;
    }
    if (field.hasError('pattern')) {
      return this.getPatternErrorMessage(fieldName);
    }
    if (field.hasError('hasSpaces')) {
      return 'Email or Username cannot contain spaces.';
    }
    if (field.hasError('invalidFormat')) {
      return 'Please enter a valid email address or username.';
    }

    return 'Invalid input.';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'storeName': 'Store Name',
      'ownerEmailOrUserName': 'Email or Username',
      'ownerName': 'Name',
      'ownerSurname': 'Surname'
    };
    return displayNames[fieldName] || fieldName;
  }

  private getPatternErrorMessage(fieldName: string): string {
    switch (fieldName) {
      case 'storeName':
        return 'Store Name can only contain letters, numbers, spaces, hyphens, underscores, ampersands, and dots.';
      case 'ownerName':
      case 'ownerSurname':
        return `${this.getFieldDisplayName(fieldName)} can only contain letters and spaces.`;
      default:
        return 'Invalid format.';
    }
  }
}