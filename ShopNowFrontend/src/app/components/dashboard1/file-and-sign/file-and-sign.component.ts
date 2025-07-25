import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DasboardServiceService } from '../services/dasboard-service.service';
import { FileAndSignViewModel } from '../models/FileAndSign';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-file-and-sign',
  standalone: true,
  imports: [SharedModule, TableModule, TabViewModule],
  templateUrl: './file-and-sign.component.html',
  styleUrl: './file-and-sign.component.scss'
})
export class FileAndSignComponent implements OnInit {
  fileAndSigndata: FileAndSignViewModel[] = [];
  dataSourceRECEIVED: { data: FileAndSignViewModel[] } = { data: [] };

  constructor(
    private dashboardService: DasboardServiceService
  ) {}

  ngOnInit() {
    this.dataSourceRECEIVED.data = this.dashboardService.fileAndSign;
  }
}