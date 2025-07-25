import { Routes } from '@angular/router';

import { AppErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginSellerComponent } from './loginSeller/login-seller/login-seller.component';
import { RegisterSellerComponent } from './register-seller/register-seller/register-seller.component';
import { VerifyOtpSellerComponent } from './verify-otp-seller/verify-otp-seller/verify-otp-seller.component';
import { ForgetPasswordSellerComponent } from './forget-password-seller/forget-password-seller/forget-password-seller.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { PasswordResetSuccessComponent } from './password-reset-success/password-reset-success.component';
import { UpdateEmailComponent } from './update-email/update-email.component';
export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: '',
      //   component: LoginSellerComponent,
      // },
      {
        path: 'error',
        component: AppErrorComponent,
      },
      {
        path: 'authentication/login',
        component: LoginComponent,
      },
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'authentication/loginSeller',
        component: LoginSellerComponent,
      },
      {
        path: 'authentication/register',
        component: RegisterComponent,
      },
      {
        path: 'authentication/register-seller',
        component: RegisterSellerComponent,
      },
      {
        path: 'authentication/forget-password',
        component: ForgetPasswordComponent,
      },
      {
        path: 'authentication/forget-password-seller',
        component: ForgetPasswordSellerComponent,
      },
      {
        path: 'authentication/reset-password',
        component: ResetPasswordComponent,
      },
      {
        path: 'authentication/verify-otp-seller',
        component: VerifyOtpSellerComponent,
      },
      {
        path: 'authentication/verify-otp',
        component: VerifyOtpComponent,
      },
      {
        path: 'authentication/password-reset-success',
        component: PasswordResetSuccessComponent,
      },
      {
        path: 'authentication/update-email',
        component: UpdateEmailComponent,
      },
    ],
  },
];
