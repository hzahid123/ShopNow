import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activate-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  template: `
    <div class="email-activation-card">
      <h3 class="card-title">Activate Email Address</h3>
      <p class="card-subtitle">Choose which email notifications you'd like to receive</p>
      
      <form [formGroup]="emailForm" class="notification-form">
        <div class="notification-item">
          <div class="notification-content">
            <h4 class="notification-title">Orders</h4>
            <p class="notification-description">Order status, tracking updates, dispute progress and more</p>
          </div>
          <mat-slide-toggle 
            formControlName="orders" 
            color="primary"
            class="notification-toggle">
          </mat-slide-toggle>
        </div>

        <div class="notification-item">
          <div class="notification-content">
            <h4 class="notification-title">Promotions</h4>
            <p class="notification-description">Discounts, sales announcements, price alerts and more</p>
          </div>
          <mat-slide-toggle 
            formControlName="promotions" 
            color="primary"
            class="notification-toggle">
          </mat-slide-toggle>
        </div>

        <div class="notification-item">
          <div class="notification-content">
            <h4 class="notification-title">Services</h4>
            <p class="notification-description">Get updates on account notices, alerts for unread messages and more</p>
          </div>
          <mat-slide-toggle 
            formControlName="services" 
            color="primary"
            class="notification-toggle">
          </mat-slide-toggle>
        </div>

        <div class="form-actions">
          <button mat-flat-button color="primary" class="save-button" (click)="saveSettings()">
            Save Settings
          </button>
          <button mat-stroked-button color="primary" class="cancel-button" (click)="cancel()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .email-activation-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin: 0 auto;
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .card-subtitle {
      color: #666;
      font-size: 0.9rem;
      margin: 0 0 2rem 0;
    }

    .notification-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .notification-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .notification-item:last-of-type {
      border-bottom: none;
    }

    .notification-content {
      flex: 1;
      margin-right: 1rem;
    }

    .notification-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .notification-description {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.4;
    }

    .notification-toggle {
      flex-shrink: 0;
    }

    /* Force primary color for slide toggles */
    ::ng-deep .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb {
      background-color: #ff5722 !important;
    }

    ::ng-deep .mat-slide-toggle.mat-checked .mat-slide-toggle-bar {
      background-color: rgba(255, 87, 34, 0.5) !important;
    }

    /* Force primary color for buttons */
    ::ng-deep .mat-flat-button.mat-primary {
      background-color: #ff5722 !important;
      color: white !important;
    }

    ::ng-deep .mat-stroked-button.mat-primary {
      border-color: #ff5722 !important;
      color: #ff5722 !important;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      justify-content: flex-end;
    }

    .save-button,
    .cancel-button {
      min-width: 120px;
    }

    @media (max-width: 768px) {
      .email-activation-card {
        padding: 1.5rem;
        margin: 1rem;
      }

      .notification-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .notification-content {
        margin-right: 0;
      }

      .notification-toggle {
        align-self: flex-end;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ActivateEmailComponent {
  emailForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      orders: [true],
      promotions: [false],
      services: [true]
    });
  }

  saveSettings() {
    const formValue = this.emailForm.value;
    console.log('Email notification settings:', formValue);
    // Handle save logic here
  }

  cancel() {
    // Handle cancel logic here
    console.log('Settings cancelled');
  }
}