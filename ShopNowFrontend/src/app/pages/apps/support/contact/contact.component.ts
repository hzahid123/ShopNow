import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private messageService: MessageService) {}

  onSubmit() {
    if (this.form.name && this.form.email && this.form.message) {
      this.messageService.add({
        severity: 'success',
        summary: 'Message Sent',
        detail: 'Thank you! We’ll get back to you soon.'
      });
      this.form = { name: '', email: '', message: '' };
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Incomplete Form',
        detail: 'Please fill in all fields.'
      });
    }
  }
}
