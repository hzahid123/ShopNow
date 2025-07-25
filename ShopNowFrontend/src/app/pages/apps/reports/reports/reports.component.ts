import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { Option } from 'src/app/pages/models/Option';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/components/dashboard1/models/ChartOptions';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ArticlesReportViewModel } from '../models/ArticlesReportViewModel';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Sort } from '@angular/material/sort';
import { ReportService } from '../services/report.service';
import { SentToViewModel } from '../models/SentToViewModel';
import { DeliveredViewModel } from '../models/DeliveredViewModel';
import { OpenedViewModel } from '../models/OpenedViewModel';
import { UniqueClicksViewModel } from '../models/UniqueClicksViewModel';
import { UniqueUserClicksViewModel } from '../models/UniqueUserClicksViewModel';
import { StatusBouncedViewModel } from '../models/StatusBouncedViewModel';
import { StatusUnOpenedViewModel } from '../models/StatusUnOpenedViewModel';
import { FailedViewModel } from '../models/FailedViewModel';
import { UnsubscribedViewModel } from '../models/UnsubscribedViewModel';
import { CallBackViewModel } from '../models/CallBackViewModel';
import { TableLazyLoadEvent } from 'primeng/table';
// import { PrimeNGConfig } from 'primeng/api'; // Import PrimeNGConfig for customization

import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule,TableModule,MenuModule,ButtonModule,CheckboxModule,PaginatorModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  selectedOption: any;
  Concept: Option[] = [];
  ConceptValue: any;
  overview = [
    {
      Sent: 11,
      Delivered: 5,
      Opened: 8,
      UniqueClicks: 0,
      UniqueUserClicks: 11,
      Bounced: 2,
      Failed: 0,
      Unsubscribed: 0,
      openRate: 70,
      clickRate: 20,
      stats: [
        {
          name: 'Successful Dileveries',
          value: '1(20%)',
        },
        {
          name: 'Total Clicks',
          value: '1',
        },
        {
          name: 'Last Opened',
          value: '3/8/2023 10:48',
        },
        {
          name: 'Last Clicked',
          value: '1',
        },
        {
          name: 'Last Updated',
          value: '1/1/2023 0:51',
        },
      ],
    },
  ];
  NumberofReports: Option[] = [];
  NumberofReportsValue: any;
  public chartOptions: Partial<ChartOptions> | any;
  public lineChartOptions: Partial<ChartOptions> | any;
  grapghActive: string;
searchArticle: any;
totalRecords: number = 0;
  pageSizes: number[] = [25, 50, 100];
  pageSize: number = this.pageSizes[0];
  pageIndex: number = 1;
  displayedColumnsArticles: string[] = [
    'articleID',
    'articleTitle',
    'recieved',
    'openRate',
    'callBacks',
    'readMore',
    'interest'
  ];
  Articlesdata: ArticlesReportViewModel[] = [];
  dataSourceArticles = new MatTableDataSource<ArticlesReportViewModel>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
    private _liveAnnouncer = inject(LiveAnnouncer);
    displayedColumnsSentTo: string[] = [
      'email',
    ];
    SentTodata: SentToViewModel[] = [];
    dataSourceSentTo = new MatTableDataSource<SentToViewModel>();
    displayedColumnsDelivered: string[] = [
      'email',
    ];
    Delivereddata: DeliveredViewModel[] = [];
    dataSourceDelivered = new MatTableDataSource<DeliveredViewModel>();
    displayedColumnsOpened: string[] = [
      'email',
      'lastOpened',
      'count'
    ];
    Openeddata: OpenedViewModel[] = [];
    dataSourceOpened = new MatTableDataSource<OpenedViewModel>();
    displayedColumnsUniqueClicks: string[] = [
      'articleTitle',
      'email',
      'lastOpened',
      'count'
    ];
    UniqueClicksdata: UniqueClicksViewModel[] = [];
    dataSourceUniqueClicks = new MatTableDataSource<UniqueClicksViewModel>();
    displayedColumnsUniqueUserClicks: string[] = [
      'email',
      'lastOpened',
      'count'
    ];
    UniqueUserClicksdata: UniqueUserClicksViewModel[] = [];
    dataSourceUniqueUserClicks = new MatTableDataSource<UniqueUserClicksViewModel>();
    displayedColumnsStatusBounced: string[] = [
      'email',
      'emailSubject',
      'type',
      'description'
    ];
    StatusBounceddata: StatusBouncedViewModel[] = [];
    dataSourceStatusBounced = new MatTableDataSource<StatusBouncedViewModel>();
    displayedColumnsStatusUnOpened: string[] = [
      'email',
    ];
    StatusUnOpenedddata: StatusUnOpenedViewModel[] = [];
    dataSourceStatusUnOpened = new MatTableDataSource<StatusUnOpenedViewModel>();
    displayedColumnsFailed: string[] = [
      'email',
      'message'
    ];
    Failedddata: FailedViewModel[] = [];
    dataSourceFailed = new MatTableDataSource<FailedViewModel>();
    displayedColumnsUnsubscribed: string[] = [
      'email',
      'unsubscribedDate'
    ];
    Unsubscribeddata: UnsubscribedViewModel[] = [];
    dataSourceUnsubscribed = new MatTableDataSource<UnsubscribedViewModel>();
    displayedColumnsCallBack: string[] = [
      'articleTitle',
      'firstname',
      'surname',
      'email',
      'date',
    ];
    CallBackdata: CallBackViewModel[] = [];
    dataSourceCallBack = new MatTableDataSource<CallBackViewModel>();
    
  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.grapghActive = '1';
    this.chartOptions = {
      series: [
        {
          name: 'April 2023 Monthly Newsletter',
          data: [44, 55, 41, 37, 22, 43],
        },
        {
          name: 'May 2023 Monthly Newsletter',
          data: [53, 32, 33, 52, 13, 43],
        },
        {
          name: 'June 2023 Monthly Newsletter',
          data: [12, 17, 11, 9, 15, 11],
        },
        {
          name: 'July 2023 Monthly Newsletter',
          data: [9, 7, 5, 8, 6, 9],
        },
        {
          name: 'August 2023 Monthly Newsletter',
          data: [25, 12, 19, 32, 25, 24],
        },
      ],
      chart: {
        type: 'bar',
        height: 450,
        stacked: true,
        toolbar: {
          show: false, // Disable the download button
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      title: {
        text: `Concept's Statistics`,
        align: 'center', // align the title to 'center', 'left', or 'right'
        margin: 10, // optional, add some margin above the chart
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#263238', // color of the title
        },
      },
      xaxis: {
        categories: [
          'Sent',
          'Delievered',
          'Opened',
          'Not Opened',
          'Unique Clicks',
          'Unsubscribe',
        ],
        labels: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
        theme: 'dark',
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
    };
    this.lineChartOptions = {
      series: [
        {
          name: 'April 2023 Monthly Newsletter',
          data: [44, 55, 41, 37, 22, 43],
        },
        {
          name: 'May 2023 Monthly Newsletter',
          data: [53, 32, 33, 52, 13, 43],
        },
        {
          name: 'June 2023 Monthly Newsletter',
          data: [12, 17, 11, 9, 15, 11],
        },
        {
          name: 'July 2023 Monthly Newsletter',
          data: [9, 7, 5, 8, 6, 9],
        },
        {
          name: 'August 2023 Monthly Newsletter',
          data: [25, 12, 19, 32, 25, 24],
        },
      ],
      chart: {
        height: 450,
        type: 'line',
        fontFamily: 'DM Sans,sans-serif',
        foreColor: '#a1aab2',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 3,
        strokeColors: 'transparent',
      },
      stroke: {
        curve: 'straight',
        width: '2',
      },
      colors: ['#06d79c', '#398bf7', '#cc0000', '#febc3b', '#8b75d7'],
      grid: {
        show: true,
        strokeDashArray: 0,
        borderColor: 'rgba(0,0,0,0.1)',
      },
      xaxis: {
        type: 'category',
        categories: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
      },
      tooltip: {
        theme: 'dark',
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 40,
      },
      title: {
        text: `Click Rate`,
        align: 'center', // align the title to 'center', 'left', or 'right'
        margin: 10, // optional, add some margin above the chart
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#263238', // color of the title
        },
      },
    };
    this.loadArticlesReport(this.pageIndex, this.pageSize);
    this.loadSentToReport();
    this.loadDeliveredReport();
    this.loadOpenedReport();
    this.loadUniqueClicksReport();
    this.loadUniqueUserClicksReport();
    this.loadStatusBouncedReport();
    this.loadStatusUnOpenedReport();
    this.loadFailedReport();
    this.loadUnsubscribedReport();
    this.loadCallBackReport();
  }

  grapgh(val: string) {
    this.grapghActive = val;
  }

  loadArticlesReport(
    pageNumber: number = 1,
    pageSize: number = 5,
    searchQuery: string = ''
  ): void {
    this.reportService
      .getArticlesReport({ pageNumber, pageSize, searchQuery })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceArticles.data = this.reportService.ArticlesReportData;
    this.totalRecords = this.reportService.ArticlesReportData.length;
  }

  loadSentToReport(): void {
    this.reportService
      .getSentToReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceSentTo.data = this.reportService.SentTodata;
    this.totalRecords = this.reportService.SentTodata.length;
  }
  
  loadDeliveredReport(): void {
    this.reportService
      .getDeliveredReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceDelivered.data = this.reportService.Delivereddata;
    this.totalRecords = this.reportService.Delivereddata.length;
  }
  
  loadOpenedReport(): void {
    this.reportService
      .getOpenedReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceOpened.data = this.reportService.Openeddata;
    this.totalRecords = this.reportService.Openeddata.length;
  }
  
  loadUniqueClicksReport(): void {
    this.reportService
      .getUniqueClicksReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceUniqueClicks.data = this.reportService.UniqueClicksdata;
    this.totalRecords = this.reportService.UniqueClicksdata.length;
  }
  
  loadUniqueUserClicksReport(): void {
    this.reportService
      .getUniqueUserClicksReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceUniqueUserClicks.data = this.reportService.UniqueUserClicksdata;
    this.totalRecords = this.reportService.UniqueUserClicksdata.length;
  }
  
  loadStatusBouncedReport(): void {
    this.reportService
      .getStatusBouncedReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceStatusBounced.data = this.reportService.StatusBounceddata;
    this.totalRecords = this.reportService.StatusBounceddata.length;
  }
  
  loadStatusUnOpenedReport(): void {
    this.reportService
      .getStatusUnOpenedReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceStatusUnOpened.data = this.reportService.StatusUnOpeneddata;
    this.totalRecords = this.reportService.StatusUnOpeneddata.length;
  }
  
  loadFailedReport(): void {
    this.reportService
      .getFailedReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceFailed.data = this.reportService.Faileddata;
    this.totalRecords = this.reportService.Faileddata.length;
  }
  
  loadUnsubscribedReport(): void {
    this.reportService
      .getUnsubscribedReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceUnsubscribed.data = this.reportService.Unsubscribeddata;
    this.totalRecords = this.reportService.Unsubscribeddata.length;
  }
  
  loadCallBackReport(): void {
    this.reportService
      .getCallBackReport()
      .subscribe({
        next: (response: any) => {
          console.log(response);
          // this.dataSource.data = response.clients;
          // this.totalRecords = response.totalRecords;
        },
        error: (error: any) => console.error('Error loading clients:', error),
      });

    this.dataSourceCallBack.data = this.reportService.CallBackdata;
    this.totalRecords = this.reportService.CallBackdata.length;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadArticlesReport(event.pageIndex + 1, event.pageSize);
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
