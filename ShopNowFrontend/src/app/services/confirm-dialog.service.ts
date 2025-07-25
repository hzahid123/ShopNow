import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private confirmationService: ConfirmationService,
  ) { }

  confirmDialog(_title: string, message: any): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        header: _title,
        message: message,
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "pi pi-check",
        rejectIcon: "pi pi-times",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      });
    });
  }


}
