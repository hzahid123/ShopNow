// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { MessageService } from 'primeng/api';
import { SharedModule } from 'src/app/shared/shared.module';

interface Country {
  name: string;
  code: string;
  phone: string;
}

interface AddressType {
  label: string;
  value: string;
  icon: string;
}

interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimeSharedModule,
    SharedModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [MessageService]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  isProcessing = false;
  cartSummary: CartSummary = {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    itemCount: 0
  };

  countries: Country[] = [
    { name: 'Pakistan', code: 'PK', phone: '+92' },
    { name: 'United States', code: 'US', phone: '+1' },
    { name: 'United Kingdom', code: 'UK', phone: '+44' },
    { name: 'Canada', code: 'CA', phone: '+1' },
    { name: 'Australia', code: 'AU', phone: '+61' },
    { name: 'India', code: 'IN', phone: '+91' },
    { name: 'Germany', code: 'DE', phone: '+49' },
    { name: 'France', code: 'FR', phone: '+33' },
    { name: 'Japan', code: 'JP', phone: '+81' },
    { name: 'China', code: 'CN', phone: '+86' }
  ];

  addressTypes: AddressType[] = [
    { label: 'Home', value: 'home', icon: 'home' },
    { label: 'Office', value: 'office', icon: 'business' },
    { label: 'Other', value: 'other', icon: 'location_on' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.initializeCheckoutForm();
  }

  ngOnInit(): void {
    this.loadCartSummary();
  }

  private initializeCheckoutForm(): void {
    this.checkoutForm = this.formBuilder.group({
      country: ['Pakistan', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      streetAddress: ['', [Validators.required, Validators.minLength(5)]],
      apartment: [''],
      stateProvince: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      addressType: ['home', Validators.required],
      setAsDefault: [false]
    });
  }

  private loadCartSummary(): void {
    // Get cart summary from query params or localStorage
    this.route.queryParams.subscribe(params => {
      if (params['fromCart']) {
        this.cartSummary = {
          subtotal: parseFloat(params['subtotal']) || 0,
          tax: parseFloat(params['tax']) || 0,
          shipping: parseFloat(params['shipping']) || 0,
          discount: parseFloat(params['discount']) || 0,
          total: parseFloat(params['total']) || 0,
          itemCount: parseInt(params['itemCount']) || 0
        };
      } else {
        // Fallback to dummy data if no params
        this.cartSummary = {
          subtotal: 52000,
          tax: 3900,
          shipping: 500,
          discount: 0,
          total: 56400,
          itemCount: 4
        };
      }
    });
  }

  onSubmitOrder(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Please fill in all required fields correctly',
        life: 5000
      });
      return;
    }

    this.isProcessing = true;

    // Simulate API call
    setTimeout(() => {
      this.isProcessing = false;
      
      // Show success message
      this.messageService.add({
        severity: 'success',
        summary: 'Order Placed Successfully!',
        detail: 'Your order has been placed and you will receive a confirmation email shortly.',
        life: 5000
      });

      // Navigate to order confirmation or home page
      setTimeout(() => {
        this.router.navigate(['/apps/order-confirmation'], {
          queryParams: { 
            orderNumber: this.generateOrderNumber(),
            total: this.cartSummary.total
          }
        });
      }, 2000);
    }, 3000);
  }

  onCancel(): void {
    this.router.navigate(['/apps/add-to-cart']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} is too short`;
      if (field.errors['pattern']) return `${this.getFieldLabel(fieldName)} format is invalid`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      country: 'Country',
      fullName: 'Full name',
      streetAddress: 'Street address',
      stateProvince: 'State/Province',
      city: 'City',
      postalCode: 'Postal code',
      phoneNumber: 'Phone number'
    };
    return labels[fieldName] || fieldName;
  }

  getSelectedCountryPhone(): string {
    const selectedCountry = this.checkoutForm.get('country')?.value;
    const country = this.countries.find(c => c.name === selectedCountry);
    return country?.phone || '+92';
  }

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use a geocoding service to get address details
          // For now, we'll just populate with dummy data
          this.checkoutForm.patchValue({
            streetAddress: '123 Main Street',
            city: 'Lahore',
            stateProvince: 'Punjab',
            postalCode: '54000'
          });

          this.messageService.add({
            severity: 'success',
            summary: 'Location Used',
            detail: 'Current location has been used to fill address fields',
            life: 3000
          });
        },
        (error) => {
          console.error('Location error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Location Error',
            detail: 'Unable to get your current location. Please enter address manually.',
            life: 5000
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Location Not Supported',
        detail: 'Geolocation is not supported by this browser.',
        life: 5000
      });
    }
  }

  // Utility methods for template
  calculateSubtotal(): number {
    return this.cartSummary.subtotal + this.cartSummary.shipping;
  }

  calculateSavings(): number {
    return this.cartSummary.subtotal * 0.2; // 20% savings
  }

  hasSavings(): boolean {
    return this.cartSummary.subtotal > 500000; // Show savings if subtotal > 500k
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp.slice(-6)}${random}`;
  }

  goBackToCart(): void {
    this.router.navigate(['/apps/add-to-cart']);
  }
}