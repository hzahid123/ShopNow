import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DasboardServiceService } from '../services/dasboard-service.service';
import { InformailerViewModel } from '../models/Informailer';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-informailer',
  standalone: true,
  imports: [SharedModule, TableModule],
  templateUrl: './informailer.component.html',
  styleUrl: './informailer.component.scss'
})
export class InformailerComponent implements OnInit {
  displayedColumns: string[] = [
    'customer',
    'status',
  ];
  informailerdata: InformailerViewModel[] = [];

  dataSource = { data: [] as InformailerViewModel[] };

  constructor(
    private dashboardService: DasboardServiceService
  ) {}

  ngOnInit() {
    this.dataSource.data = this.dashboardService.informailer;
  }
}