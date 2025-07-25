import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent {
  options = this.settings.getOptions();
  resendCountdown = 59;
isResendDisabled = true;
countdownInterval: any;

  constructor(private settings: CoreService, private router: Router) {
  this.startResendCountdown();
}
startResendCountdown() {
  this.isResendDisabled = true;
  this.resendCountdown = 59;

  this.countdownInterval = setInterval(() => {
    this.resendCountdown--;
    if (this.resendCountdown <= 0) {
      clearInterval(this.countdownInterval);
      this.isResendDisabled = false;
    }
  }, 1000);
}

  form = new FormGroup({
    otp1: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp2: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp3: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp4: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp5: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    otp6: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
  });
  
  get f() {
    return this.form.controls;
  }
  
  onOtpChange(event: any, nextInput: string, prevInput: string) {
    const input = event.target;
    const value = input.value;
    
    // Only allow single digit
    if (value.length > 1) {
      input.value = value.slice(0, 1);
      this.form.get(input.name)?.setValue(input.value);
    }
    
    // Move to next input if digit entered
    if (value.length === 1 && /^\d$/.test(value)) {
      if (nextInput) {
        const nextElement = document.getElementById(nextInput) as HTMLInputElement;
        if (nextElement) {
          nextElement.focus();
        }
      }
    }
  }
  
  onKeyDown(event: KeyboardEvent, currentInput: string, prevInput: string) {
    const input = event.target as HTMLInputElement;
    
    // Handle Enter key for form submission
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.form.valid) {
        this.submit();
      }
      return;
    }
    
    // Handle backspace
    if (event.key === 'Backspace' && input.value === '' && prevInput) {
      const prevElement = document.getElementById(prevInput) as HTMLInputElement;
      if (prevElement) {
        prevElement.focus();
      }
    }
    
    // Only allow numbers and control keys
    if (!/[\d]/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'Clear', 'Copy', 'Paste'].includes(event.key)) {
      event.preventDefault();
    }
  }
  
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    const digits = pasteData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length > 0) {
      const otpControls = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];
      
      for (let i = 0; i < otpControls.length && i < digits.length; i++) {
        this.form.get(otpControls[i])?.setValue(digits[i]);
        const element = document.getElementById(otpControls[i]) as HTMLInputElement;
        if (element) {
          element.value = digits[i];
        }
      }
      
      // Focus on the next empty input or last input
      const nextEmptyIndex = Math.min(digits.length, 5);
      const nextElement = document.getElementById(otpControls[nextEmptyIndex]) as HTMLInputElement;
      if (nextElement) {
        nextElement.focus();
      }
    }
  }
  
  getOtpValue(): string {
    return Object.values(this.form.value).join('');
  }
  
  submit() {
    if (this.form.valid) {
      const otpValue = this.getOtpValue();
      this.router.navigate(['/authentication/authentication/reset-password']);
    }
  }
  
 resendOtp() {
  this.form.reset();
  const firstInput = document.getElementById('otp1') as HTMLInputElement;
  if (firstInput) firstInput.focus();

  this.startResendCountdown();

  // ...resend OTP
}

   
  
}