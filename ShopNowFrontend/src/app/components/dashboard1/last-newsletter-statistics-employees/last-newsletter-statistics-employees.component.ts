import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../models/ChartOptions';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-last-newsletter-statistics-employees',
  standalone: true,
  imports: [SharedModule,NgApexchartsModule],
  templateUrl: './last-newsletter-statistics-employees.component.html',
  styleUrl: './last-newsletter-statistics-employees.component.scss'
})
export class LastNewsletterStatisticsEmployeesComponent {
  public chartOptions: Partial<ChartOptions> | any;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Sent",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 14,78,21]
        },
        {
          name: "Dilevered",
          data: [10,  62, 69, 91, 148,41, 35, 51, 49,85,32,84]
        },
        {
          name: "Opened",
          data: [49, 62, 69, 91, 148, 10, 41, 35, 51,4,52,78 ]
        }
      ],
      chart: {
        height: 450,
        type: "line",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false // Disable the download button
        }
      },
      colors: ['#28a745', '#ffc107', '#dc3545'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      }
    };
  }
}
