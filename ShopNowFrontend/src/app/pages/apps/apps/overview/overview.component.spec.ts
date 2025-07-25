import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    CardModule
  ]
})
export class OverviewModule {}
