
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder,FormGroup,Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'reset-password', 
  standalone: true, 
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html', 
  styleUrl: './reset-password.component.css' 
})
export class ResetPasswordComponent {

  options = this.settings.getOptions();


  form: FormGroup;


  constructor(
    private settings: CoreService, 
    private router: Router,       
    private fb: FormBuilder        
  ) {
   
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator 
    });
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      group.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  // Shortcut to access form controls easily in HTML
  get f() {
    return this.form.controls;
  }

  
  submit() {
    if (this.form.valid) {
     
      this.router.navigate(['/authentication/authentication/password-reset-success']); // Redirect after successful reset
    }
  }
}