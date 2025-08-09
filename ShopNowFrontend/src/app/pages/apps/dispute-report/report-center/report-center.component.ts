// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-report-center',
//   standalone: true,
//   imports: [],
//   templateUrl: './report-center.component.html',
//   styleUrl: './report-center.component.scss'
// })
// export class ReportCenterComponent {

// }

import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-report-center',
  standalone: true,
  imports: [RouterModule, MatIconModule, NgIf],
  templateUrl: './report-center.component.html',
  styleUrls: ['./report-center.component.scss']
})
export class ReportCenterComponent {
  private router = inject(Router);

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
