import { ApiService } from '../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';

interface YearOption {
  label: string;
  value: number;
}

@Component({
  selector: 'sales-dashboard',
  standalone: true,
  imports: [ChartModule, DropdownModule, FormsModule, CommonModule, TableModule, SharedModule],
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss']
})
export class SalesDashboardComponent implements OnInit {
  selectedYear = 2025;
  data: any;
  options: any;
  pieData: any;
  pieOptions: any;
  plugins: any[] = [];
  totalSales: number = 0;
  totalOrders: number = 0;
  totalCustomers: number = 0;
  recentOrders: any[] = [];
  products: any[] = [];
  orderStatusCounts: any[] = []; // New property to store order status data
  yearOptions: YearOption[] = [
    { label: '2021', value: 2021 },
    { label: '2022', value: 2022 },
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 }
  ];

  constructor(private apiService: ApiService) {}

  loadTotalSales() {
    this.apiService.getTotalSalesByStore('32701114-3f77-42b4-216b-08ddb7d0de62').subscribe(
      response => {
        this.totalSales = response.totalSales || 0;
      },
      error => {
        console.error('Error fetching total sales:', error);
      }
    );
  }

  loadTotalOrders() {
    this.apiService.getTotalOrdersByStore('32701114-3f77-42b4-216b-08ddb7d0de62').subscribe(
      response => {
        this.totalOrders = response.totalOrders || 0;
      },
      error => {
        console.error('Error fetching total orders:', error);
      }
    );
  }

  loadTotalCustomers() {
    this.apiService.getTotalCustomersByStore('32701114-3f77-42b4-216b-08ddb7d0de62').subscribe(
      response => {
        this.totalCustomers = response.totalCustomers || 0;
      },
      error => {
        console.error('Error fetching total customers:', error);
      }
    );
  }

  loadRecentOrders() {
    this.apiService.getRecentOrdersByStore('32701114-3f77-42b4-216b-08ddb7d0de62', 5).subscribe(
      response => {
        this.recentOrders = response || [];
      },
      error => {
        console.error('Error fetching recent orders:', error);
      }
    );
  }

  loadTopProducts() {
    this.apiService.getTopProductsByStore('32701114-3f77-42b4-216b-08ddb7d0de62', 5)
      .subscribe(
        (response) => {
          this.products = response || [];
        },
        (error) => {
          console.error('Error fetching top products:', error);
        }
      );
  }

  // New method to load order status counts
  loadOrderStatusCounts() {
    this.apiService.getOrderCountByStatus('32701114-3f77-42b4-216b-08ddb7d0de62').subscribe(
      response => {
        this.orderStatusCounts = response || [];
        this.updatePieChart(); // Update pie chart with new data
      },
      error => {
        console.error('Error fetching order status counts:', error);
        this.orderStatusCounts = [];
        this.updatePieChart(); // Update with empty data
      }
    );
  }

  loadMonthlySalesData() {
    this.apiService.getMonthlySalesByStore('32701114-3f77-42b4-216b-08ddb7d0de62', this.selectedYear).subscribe(
      response => {
        // Transform the API response to chart data
        const monthlyData = new Array(12).fill(0); // Initialize with zeros
        
        if (response && Array.isArray(response)) {
          response.forEach((item: any) => {
            const monthIndex = item.monthNumber - 1; // API returns 1-12, array is 0-11
            monthlyData[monthIndex] = item.totalSales || 0;
          });
        }
        
        // Update the chart data
        this.data = {
          ...this.data,
          datasets: [{
            ...this.data.datasets[0],
            data: monthlyData
          }]
        };
      },
      error => {
        console.error('Error fetching monthly sales data:', error);
        // Fallback to zeros if API fails
        this.data = {
          ...this.data,
          datasets: [{
            ...this.data.datasets[0],
            data: new Array(12).fill(0)
          }]
        };
      }
    );
  }

  ngOnInit() {
    this.initializeChart();
    this.initializePieChart();
    this.initializePlugins();
    this.loadTotalOrders();
    this.loadTotalSales();
    this.loadTotalCustomers();
    this.loadRecentOrders();
    this.loadTopProducts();
    this.loadMonthlySalesData();
    this.loadOrderStatusCounts(); // Load order status data
  }

  initializeChart() {
    this.data = {
      labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      datasets: [{
        label: 'Sales',
        data: new Array(12).fill(0), // Initialize with zeros, will be populated by API
        fill: true,
        borderColor: '#FFA726',
        backgroundColor: (ctx: any) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(255, 167, 38, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 167, 38, 0.05)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        borderWidth: 3
      }]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#22C55E',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderWidth: 0,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: () => '',
            label: (context: any) => `${context.parsed.y.toFixed(0)} sales\n₦${context.parsed.y.toFixed(0)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#9e9e9e', font: { size: 12 } }
        },
        y: {
          min: 0,
          position: 'right',
          ticks: {
            callback: (value: any) => `${value}`,
            color: '#9e9e9e'
          },
          grid: { color: '#f0f0f0', borderDash: [3, 3] }
        }
      }
    };
  }

  initializePlugins() {
    this.plugins = [{
      id: 'crosshair',
      afterDraw: (chart: any) => {
        if (chart.tooltip._active && chart.tooltip._active.length) {
          const ctx = chart.ctx;
          const activePoint = chart.tooltip._active[0];
          const x = activePoint.element.x;
          const topY = chart.scales.y.top;
          const bottomY = chart.scales.y.bottom;

          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = '#FFA726';
          ctx.lineWidth = 2;
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.stroke();
          ctx.restore();
        }
      }
    }];
  }

  initializePieChart() {
    // Initialize with empty data, will be populated by API
    this.pieData = {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#22C55E', '#FFA726', '#EF4444'],
        borderWidth: 0,
        hoverBorderWidth: 0
      }]
    };

    this.pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#374151',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderWidth: 0,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value} orders`;
            }
          }
        }
      }
    };
  }

 
  updatePieChart() {
    if (!this.orderStatusCounts || this.orderStatusCounts.length === 0) {
      this.pieData = {
        ...this.pieData,
        datasets: [{
          ...this.pieData.datasets[0],
          data: [0, 0, 0]
        }]
      };
      return;
    }

    const statusMap: { [key: number]: number } = {};
    this.orderStatusCounts.forEach(item => {
      statusMap[item.orderStatus] = item.totalOrders || 0;
    });

    const chartData = [
      statusMap[0] || 0, // Approved
      statusMap[1] || 0, // Pending
      statusMap[2] || 0  // Rejected
    ];

    this.pieData = {
      ...this.pieData,
      datasets: [{
        ...this.pieData.datasets[0],
        data: chartData
      }]
    };
  }

  onYearChange() {
    this.loadMonthlySalesData(); 
  }

  getOrderStatusCounts() {
    const statusMap: { [key: string]: number } = {
      approved: 0,
      pending: 0,
      rejected: 0
    };

    this.orderStatusCounts.forEach(item => {
      const statusName = this.getStatusLabel(item.orderStatus).toLowerCase();
      statusMap[statusName] = item.totalOrders || 0;
    });

    return statusMap;
  }

  getStatusPercentage(status: string): number {
    const counts = this.getOrderStatusCounts();
    const total = counts['approved'] + counts['pending'] + counts['rejected'];
    if (total === 0) return 0;
    return Math.round((counts[status.toLowerCase()] / total) * 100);
  }

  getStatusSeverity(status: string): string {
    const statusMap: { [key: string]: string } = {
      'approved': 'success',
      'pending': 'warning',
      'rejected': 'danger'
    };
    return statusMap[status.toLowerCase()] || 'info';
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Approved';
      case 1:
        return 'Pending';
      case 2:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }
}