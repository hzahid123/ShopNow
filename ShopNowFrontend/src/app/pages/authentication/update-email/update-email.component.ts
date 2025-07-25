// Angular core and routing
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Reactive Forms modules
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

// Shared modules and services
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-update-email',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-email.component.html',
  styleUrl: './update-email.component.scss'
})
export class UpdateEmailComponent {
  options = this.settings.getOptions();
  form: FormGroup;

  // Add this line
  currentEmail: string = 'mareeha@example.com'; // Replace with actual dynamic value if available

  constructor(
    private settings: CoreService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]]
    }, {
      validators: this.emailsMatchValidator
    });
  }

 emailsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const email = group.get('email')?.value;
  const confirmEmail = group.get('confirmEmail')?.value;

  return email && confirmEmail && email !== confirmEmail ? { mismatch: true } : null;
}


  get f() {
    return this.form.controls;
  }

 submit() {
  if (this.form.valid) {
    this.router.navigate(['/authentication/authentication/verify-otp']);
  }
}

}

