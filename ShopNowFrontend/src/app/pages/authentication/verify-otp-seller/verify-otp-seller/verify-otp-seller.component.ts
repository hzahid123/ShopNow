// verify-otp-seller.component.ts
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-verify-otp-seller',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputOtpModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './verify-otp-seller.component.html',
  styleUrl: './verify-otp-seller.component.scss'
})
export class VerifyOtpSellerComponent implements OnDestroy {
  options = this.settings.getOptions();
  
  // PrimeNG OTP uses a single string value
  otpValue: string = '';
  
  usernameAndEmail: string = '';
  countdown: number = 60;
  isResendDisabled: boolean = true;
  private timerSubscription?: Subscription;

  constructor(
    private settings: CoreService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.startTimer();
    this.route.queryParams.subscribe(params => {
      this.usernameAndEmail = params['email'] || '';
    });
  }

  startTimer(): void {
    this.isResendDisabled = true;
    this.countdown = 60;

    this.timerSubscription?.unsubscribe();

    this.timerSubscription = interval(1000).pipe(take(60)).subscribe(sec => {
      this.countdown = 60 - sec - 1;
      if (this.countdown === 0) {
        this.isResendDisabled = false;
      }
    });
  }

  onResend(): void {
    if (!this.isResendDisabled) {
      const encodedEmail = encodeURIComponent(this.usernameAndEmail);
      const url = `https://localhost:44311/api/TokenAuth/ResendOtp?EmailAddress=${encodedEmail}`;

      this.http.post(url, {}).subscribe({
        next: () => {
          alert('OTP resent successfully.');
          this.startTimer();
        },
        error: (err) => {
          console.error('Resend OTP failed', err);
          alert('Failed to resend OTP.');
        }
      });
    }
  }

  onVerify(): void {
    if (!this.otpValue || this.otpValue.length !== 6) {
      alert('Please enter all 6 digits of the OTP.');
      return;
    }

    const payload = {
      otp: this.otpValue,
      usernameAndEmail: this.usernameAndEmail,
      storeId: sessionStorage.getItem('user.storeId')
    };

    this.http.post('https://localhost:44311/api/TokenAuth/VerifyOtp', payload).subscribe({
      next: (res: any) => {
        alert('OTP Verified successfully!');
        this.router.navigate(['/dashboards/dashboard1']);
      },
      error: (err) => {
        console.error('OTP verification failed', err);
        alert('Invalid OTP. Please try again.');
      }
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}