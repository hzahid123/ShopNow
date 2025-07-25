import { Component } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppTopCardsComponent } from '../../../components/dashboard1/top-cards/top-cards.component';
import { LastNewsletterStatisticsClientsComponent } from "../../../components/dashboard1/last-newsletter-statistics-clients/last-newsletter-statistics-clients.component";
import { LastNewsletterStatisticsEmployeesComponent } from "../../../components/dashboard1/last-newsletter-statistics-employees/last-newsletter-statistics-employees.component";
import { InformailerComponent } from "../../../components/dashboard1/informailer/informailer.component";
import { FileAndSignComponent } from "../../../components/dashboard1/file-and-sign/file-and-sign.component";
import { InfolearningComponent } from "../../../components/dashboard1/infolearning/infolearning.component";
import { HighAchieversComponent } from "../../../components/dashboard1/high-achievers/high-achievers.component";

@Component({
  selector: 'app-dashboard1',
  standalone: true,
  imports: [
    TablerIconsModule,
    AppTopCardsComponent,
    ToastModule,
    LastNewsletterStatisticsClientsComponent,
    LastNewsletterStatisticsEmployeesComponent,
    InformailerComponent,
    FileAndSignComponent,
    InfolearningComponent,
    HighAchieversComponent
],
  providers: [MessageService],
  templateUrl: './dashboard1.component.html',
})
// export class AppDashboard1Component {
//   constructor(private messageService: MessageService) {}

//   ngOnInit(){
//     setTimeout(() => {
//       this.showtoast()
//     }, 500);
//   }

  // showtoast() {
  //   this.messageService.add({
  //     severity: 'success',
  //     summary: 'Success',
  //     detail: 'Client Added Own Articles',
  //   });
  //   this.messageService.add({
  //     severity: 'info',
  //     summary: 'Info',
  //     detail: 'Data Importing',
  //   });
  //   this.messageService.add({
  //     severity: 'warn',
  //     summary: 'Warn',
  //     detail: 'Social Media Failed',
  //   });
  //   this.messageService.add({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: 'Connection Failed',
  //   });
    // this.messageService.add({
    //   severity: 'secondary',
    //   summary: 'Secondary',
    //   detail: 'Message Content',
    // });
    // this.messageService.add({
    //   severity: 'contrast',
    //   summary: 'Error',
    //   detail: 'Message Content',
    // });
  // }
// }
export class AppDashboard1Component {
  constructor(private messageService: MessageService) {}

  // Call this after a successful action
  showSuccessToast() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Client Added Own Articles',
    });
  }

  showInfoToast() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Data Importing',
    });
  }

  showWarnToast() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: 'Social Media Failed',
    });
  }

  showErrorToast() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Connection Failed',
    });
  }

  // Example usage in your component methods:
  addArticle() {
    // ...your add logic...
    this.showSuccessToast();
  }

  importData() {
    // ...your import logic...
    this.showInfoToast();
  }

  handleSocialMediaFail() {
    // ...your fail logic...
    this.showWarnToast();
  }

  handleConnectionError() {
    // ...your error logic...
    this.showErrorToast();
  }
}