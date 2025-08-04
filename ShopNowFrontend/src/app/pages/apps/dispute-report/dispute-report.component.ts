import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'dispute-report',
  standalone: true,
  imports: [RouterModule,SharedModule, PrimeSharedModule, FormsModule],
  templateUrl: './dispute-report.component.html',
  styleUrls: ['./dispute-report.component.scss']
})
export class DisputeReportComponent {
  private router = inject(Router);

  goToDispute() {
    this.router.navigate(['/apps/order-customer']);
  }

  goToReport() {
  this.router.navigate(['/apps/support/dispute-report/report-center']);

  }
}
