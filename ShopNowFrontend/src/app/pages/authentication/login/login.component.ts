import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CoreService } from 'src/app/services/core.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  options = this.settings.getOptions();
  loginForm!: FormGroup;
  emailError = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private settings: CoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      uname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberClient:[false, [Validators.required]]
    });
  }

  onEmailChange(): void {
    const email = this.loginForm.get('uname')?.value;
    this.emailError = email.includes(' ');
  }

  async onSubmit(): Promise<void> {
  if (this.loginForm.invalid || this.emailError) {
    return;
  }

  const { uname, password , rememberClient } = this.loginForm.value;
  this.loading = true;

  try {
    // Step 1: Fetch user by username/email
    const userResponse = await firstValueFrom(this.apiService.getUserEntityByNameAndEmail(uname));
    const user = userResponse?.result;
    //localStorage.setItem('user', JSON.stringify(user));


    if (!user) {
      alert('Authentication failed. Please check your credentials.');
      return;
    }

    // Step 2: Check 2FA
   const response1 = await firstValueFrom(this.apiService.getAuthCheck(user.id));

    const isTfa = response1.result;
     const isSuccess = response1.success;
    const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(uname);

    if (isTfa && !isEmailFormat) {
      alert('Please log in using your email address only.');
      return;
    }

    // Step 3: Authenticate
    const authPayload = { userNameOrEmailAddress: uname, password , tenancyName:'Default' , rememberClient , storeId: user.storeId };
    const response = await firstValueFrom(this.apiService.authenticate(authPayload,false));

    // Step 4: Redirect
    if (false) {
      this.router.navigate(['/authentication/authentication/verify-otp-seller'], {
        queryParams: { email: uname, password }
      });
    } else {
        
      sessionStorage.setItem('accessToken', response.result.accessToken);
      sessionStorage.setItem('user.storeId', user.storeId); 
      sessionStorage.setItem('customer_id', String(user.id)); 
      console.log(response.result.accessToken);
      this.router.navigate(['/dashboards/dashboard1']);
    }

  } catch (error: any) {
    alert(error?.message || 'Authentication failed. Please check your credentials.');
  } finally {
    this.loading = false;
  }
}


  onForgotPassword(): void {
    this.router.navigate(['/authentication/authentication/forget-password']);
  }
}
