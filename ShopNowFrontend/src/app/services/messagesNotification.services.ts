import { Injectable } from '@angular/core';
import {MessageService } from 'primeng/api';   
@Injectable({
  providedIn: 'root',
})
export class MessagesNotificationService {

  constructor(
    private messageService: MessageService
  ) { }

    showSuccessMessage(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

   showErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }

   showWarningMessage(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message,
      life: 4000
    });
  }

  
}
