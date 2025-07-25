import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
interface YearOption {
  label: string;
  value: number;
}
interface RecentStore {
  name: string;
  ownerId: number;
  creationTime: Date;
}


Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, FormsModule, DropdownModule, TableModule, SharedModule],
  standalone: true
})
export class AdminDashboardComponent implements OnInit {

  totalSales: number = 0;
  totalOrders: number = 0;
  totalStores: number = 0;
  totalUsers: number = 0;
  totalWishlistItems: number = 0;
  totalStoreFollowers: number = 0;
  selectedYear: number = new Date().getFullYear();
  monthlySalesChart: any;
  monthlySalesData: any[] = new Array(12).fill(0);
  
  // Dummy data for charts and tables
  topFollowedStoresData: any[] = [];
  topSellingProductsData: any[] = [];
  topSellingProductsChart: any;
  totalPendingStoreRequests: number = 0;
  recentStores: RecentStore[] = [];
  recentUnapprovedReviews: any[] = [];
  topFollowedStoresChart: any;
  orderStatusData: any = {};
  orderStatusChart: any; 
  topStoresBySalesData: any[] = [];
  topStoresBySalesChart: any;
  topWishlistedProductsData: any[] = [];
  topWishlistedProductsChart: any;
   yearOptions: YearOption[] = [
    { label: '2021', value: 2021 },
    { label: '2022', value: 2022 },
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 }
  ];


  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadTotalOrders();
    this.loadTotalSales();
    this.loadTotalStores();
    this.loadTotalUsers();
    this.loadTotalStoreFollowers();
    this.loadTotalWishlistItems();
    this.loadMonthlySales();
    this.loadTopFollowedStores();
    this.loadTopSellingProducts();
    this.loadRecentStores();
    this.loadPendingStoreRequests();
    this.loadRecentUnapprovedReviews();
    this.loadOrderStatusData();
    this.loadTopStoresBySales();
    this.loadTopWishlistedProducts();
    // Initialize charts after view init
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  loadTotalSales() {
    this.apiService.getTotalSales().subscribe(
      count => this.totalSales = count,
    );
  }

  loadTopWishlistedProducts() {
  this.apiService.getTopWishlistedProducts(5).subscribe({
    next: (response) => {
      this.topWishlistedProductsData = response.result || response;
      this.updateTopWishlistedProductsChart();
    },
    error: (error) => console.error(error)
  });
  }

  loadPendingStoreRequests() {
  this.apiService.getTotalPendingStoreRequests().subscribe(
    count => this.totalPendingStoreRequests = count
  );
  }

  loadTotalOrders() {
    this.apiService.getTotalOrders().subscribe(
      count => this.totalOrders = count,
    );
  }

  loadTotalWishlistItems() {
    this.apiService.getTotalWishlistItems().subscribe(
      count => this.totalWishlistItems = count,
    );
  }

  loadTotalStores() {
    this.apiService.getTotalStores().subscribe(
      count => this.totalStores = count,
    );
  }

  loadTotalStoreFollowers() {
    this.apiService.getTotalStoreFollowers().subscribe(
      count => this.totalStoreFollowers = count,
    );
  }

  loadTotalUsers() {
    this.apiService.getTotalUsers().subscribe(
      count => this.totalUsers = count,
    );
  }

  loadMonthlySales() {
  this.apiService.getMonthlySalesAllStores(this.selectedYear).subscribe({
    next: (response) => {
      this.monthlySalesData = new Array(12).fill(0);
      response.result.forEach((item: any) => {
        this.monthlySalesData[item.monthNumber - 1] = item.totalSales;
      });
      this.updateMonthlySalesChart();
    },
    error: (error) => console.error( error)
  });
  }

  loadTopFollowedStores() {
  this.apiService.getTopFollowedStores(5).subscribe({
    next: (response) => {
      this.topFollowedStoresData = response.result || response;
      console.log('Top followed stores data:', this.topFollowedStoresData); // Debug log
      this.updateTopFollowedStoresChart();
    },
    error: (error) => console.error( error)
  });
  }

  loadTopSellingProducts() {
  this.apiService.getTopSellingProducts(5).subscribe({
    next: (response) => {
      this.topSellingProductsData = response.result || response;
      console.log('Top selling products data:', this.topSellingProductsData); // Debug log
      this.updateTopSellingProductsChart();
    },
    error: (error) => console.error('Error fetching top selling products:', error)
  });
  }

  loadRecentStores() {
  this.apiService.getRecentStores(5).subscribe({
    next: (response) => {
      this.recentStores = response.result.map((store: any) => ({
        name: store.name,
        ownerId: store.ownerId,
        creationTime: new Date(store.creationTime)
      }));
      console.log('Recent stores loaded:', this.recentStores);
    },
    error: (error) => console.error('Error fetching recent stores:', error)
  });
  }

  loadRecentUnapprovedReviews() {
  this.apiService.getRecentUnapprovedReviews(5).subscribe({
    next: (response) => {
      this.recentUnapprovedReviews = response.result.map((review: any) => ({
        userName: review.userName,
        productName: review.productName,
        rating: review.rating,
        reviewText: review.reviewText,
        creationTime: new Date(review.creationTime)
      }));
    },
    error: (error) => console.error('Error fetching recent unapproved reviews:', error)
  });
  }

  loadOrderStatusData() {
  this.apiService.getTotalOrderCountByStatus().subscribe({
    next: (response) => {
      this.orderStatusData = response;
      this.updateOrderStatusChart(); 
    },
    error: (error) => console.error('Error fetching order status data:', error)
  });
}

loadTopStoresBySales() {
  this.apiService.getTopStoresBySales(5).subscribe({
    next: (response) => {
      console.log('API response:', response);
      this.topStoresBySalesData = response.result || response;
      console.log('Processed data:', this.topStoresBySalesData);
      this.updateTopStoresBySalesChart();
    },
    error: (error) => console.error('Error fetching top stores by sales:', error)
  });
}
  private initializeCharts() {
    this.createMonthlySalesChart();
    this.createTopFollowedStoresChart();
    this.createTopSellingProductsChart();
    this.createOrderStatusChart();
    this.createTopStoresBySalesChart();
    this.createTopWishlistedProductsChart();
    
  }

private createMonthlySalesChart() {
 const ctx = document.getElementById('monthlySalesChart') as HTMLCanvasElement;

 const verticalLinePlugin = {
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
       ctx.strokeStyle = '#254a48d3';
       ctx.lineWidth = 2;
       ctx.moveTo(x, topY);
       ctx.lineTo(x, bottomY);
       ctx.stroke();
       ctx.restore();
     }
   }
 };

 this.monthlySalesChart = new Chart(ctx, {
   type: 'line',
   data: {
     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
     datasets: [{
       data: [],
       borderColor: '#0e5e8cff',
       backgroundColor: 'rgba(32, 178, 170, 0.1)',
       fill: true,
       tension: 0.4
     }]
   },
   options: {
     responsive: true,
     maintainAspectRatio: false,
     interaction: {
       mode: 'index',
       intersect: false,
     },
     plugins: {
       legend: {
         display: false
       },
       tooltip: {
         mode: 'index',
         axis: 'x',
         intersect: false,
         backgroundColor: 'rgba(0, 0, 0, 0.8)',
         titleColor: '#fff',
         bodyColor: '#fff',
         borderColor: '#254a48d3',
         borderWidth: 1,
         cornerRadius: 8,
         displayColors: false,
         callbacks: {
           title: function (context: any) {
             return context[0].label;
           },
           label: function (context: any) {
             return 'Sales: PKR ' + context.parsed.y.toLocaleString();
           }
         }
       }
     },
     scales: {
       y: {
         beginAtZero: true
       }
     },
     onHover: (event: any, activeElements: any, chart: any) => {
       chart.canvas.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
     }
   },
   plugins: [verticalLinePlugin]
 });
}

private updateTopFollowedStoresChart() {
  if (this.topFollowedStoresChart) {
    const labels = this.topFollowedStoresData.map(store => store.storeName);
    const data = this.topFollowedStoresData.map(store => store.followerCount);
   
    this.topFollowedStoresChart.data.labels = labels;
    this.topFollowedStoresChart.data.datasets[0].data = data;
    this.topFollowedStoresChart.update();
  }
}

private createTopFollowedStoresChart() {
 const ctx = document.getElementById('topFollowedStoresChart') as HTMLCanvasElement;
 this.topFollowedStoresChart = new Chart(ctx, {
   type: 'bar',
   data: {
     labels: [],
     datasets: [{
       label: 'Followers',
       data: [],
       backgroundColor: ['#0d6ba1', '#48a3d1', '#FFA351', '#075A6E', '#E0F2F1'],
       borderRadius: 8
     }]
   },
   options: {
     responsive: true,
     maintainAspectRatio: false,
     indexAxis: 'y',
     plugins: {
       legend: {
         display: false
       }
     },
     scales: {
       x: {
         beginAtZero: true
       }
     }
   }
 });
}

private updateTopSellingProductsChart() {
  if (this.topSellingProductsChart) {
    // Changed from 'productName' to 'name' based on your API response
    const labels = this.topSellingProductsData.map(product => product.name);
    const data = this.topSellingProductsData.map(product => product.totalSold);
 
    this.topSellingProductsChart.data.labels = labels;
    this.topSellingProductsChart.data.datasets[0].data = data;
    this.topSellingProductsChart.update();
  }
}

private createTopSellingProductsChart() {
    const ctx = document.getElementById('topSellingProductsChart') as HTMLCanvasElement;
    this.topSellingProductsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Units Sold',
          data: [],
backgroundColor: ['#0d6ba1', '#48a3d1', '#FFA351', '#075A6E', '#E0F2F1'],

          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
}

private createOrderStatusChart() {
  const ctx = document.getElementById('orderStatusChart') as HTMLCanvasElement;
  this.orderStatusChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Pending', 'Processing', 'Shipped', 'Delivered'], // Updated labels
      datasets: [{
        data: [],
        backgroundColor: ['#0d6ba1', '#48a3d1', '#FFA351', '#075A6E'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}
private updateOrderStatusChart() {
  if (this.orderStatusChart && this.orderStatusData.result) {
  
    const data = [0, 0, 0, 0]; // [pending, processing, shipped, delivered]
    
   
    this.orderStatusData.result.forEach((item: any) => {
      data[item.orderStatus] = item.totalOrders;
    });
    
    this.orderStatusChart.data.datasets[0].data = data;
    this.orderStatusChart.update();
  }
}
private createTopStoresBySalesChart() {
  const ctx = document.getElementById('topStoresBySalesChart') as HTMLCanvasElement;
  this.topStoresBySalesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Sales (PKR)',
        data: [],
        backgroundColor: ['#0d6ba1', '#48a3d1', '#FFA351', '#E0F2F1', '#075A6E'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
private updateTopStoresBySalesChart() {
  if (this.topStoresBySalesChart) {
    const labels = this.topStoresBySalesData.map(store => store.storeName);
    const data = this.topStoresBySalesData.map(store => store.totalSales);
    
    console.log('Top stores by sales labels:', labels);
    console.log('Top stores by sales data:', data);
    
    this.topStoresBySalesChart.data.labels = labels;
    this.topStoresBySalesChart.data.datasets[0].data = data;
    this.topStoresBySalesChart.update();
  } else {
    console.log('Chart not initialized yet');
  }
}
private createTopWishlistedProductsChart() {
  const ctx = document.getElementById('topWishlistedProductsChart') as HTMLCanvasElement;
  this.topWishlistedProductsChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ['#0d6ba1', '#48a3d1', '#FFA351', '#E0F2F1', '#075A6E'],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}
private updateTopWishlistedProductsChart() {
  if (this.topWishlistedProductsChart) {
    const labels = this.topWishlistedProductsData.map(product => product.productName);
    const data = this.topWishlistedProductsData.map(product => product.wishlistCount);
    
    this.topWishlistedProductsChart.data.labels = labels;
    this.topWishlistedProductsChart.data.datasets[0].data = data;
    this.topWishlistedProductsChart.update();
  }
}
  private updateMonthlySalesChart() {
    if (this.monthlySalesChart) {
      this.monthlySalesChart.data.datasets[0].data = this.monthlySalesData;
      this.monthlySalesChart.update();
    }
  }
  onYearChange() {
  this.loadMonthlySales();
}
}