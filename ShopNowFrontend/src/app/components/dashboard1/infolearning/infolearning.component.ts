import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from 'primeng/table';
import { InfolearningViewModel } from '../models/Infolearning';
import { DasboardServiceService } from '../services/dasboard-service.service';

@Component({
  selector: 'app-infolearning',
  standalone: true,
  imports: [SharedModule,TableModule],
  templateUrl: './infolearning.component.html',
  styleUrls: ['./infolearning.component.scss']
})
export class InfolearningComponent implements OnInit {
  displayedColumns: string[] = ['title', 'status'];
  infolearningdata: InfolearningViewModel[] = [];

  constructor(private dashboardService: DasboardServiceService) {}

  ngOnInit() {
    this.infolearningdata = this.dashboardService.infolearning;
  }
}