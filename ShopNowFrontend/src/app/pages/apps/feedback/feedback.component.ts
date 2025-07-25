import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltip } from '@angular/material/tooltip';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
interface FeedbackOrder {
  orderNo: string;
  orderDetails: string;
  storeName: string;
  feedback: string;
  status?: string;
  orderInfo: string;
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  standalone: true,
  imports: [
     CommonModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule, TooltipModule, MatTooltip,
  MatIconModule,
  MatChipsModule,
  TableModule,        // Add
  ButtonModule,       // Add  
  InputTextModule , SharedModule, PrimeSharedModule
  ]
})
export class FeedbackComponent {
  selectedTab: string = 'orders';
  searchOrderNo: string = '';
  searchProductName: string = '';
  // Sample data for illustration
  ordersAwaitingFeedback: FeedbackOrder[] = [
    { 
      orderNo: 'ORD-1001', 
      orderDetails: 'Order #1001 - Wireless Headphones', 
      storeName: 'Electronics World',
      feedback: 'Pending', 
      orderInfo: 'Sony WH-1000XM4 Headphones'
    },
    { 
      orderNo: 'ORD-1002', 
      orderDetails: 'Order #1002 - Running Shoes', 
      storeName: 'Sports Hub',
      feedback: 'Pending', 
      orderInfo: 'Nike Air Max 270'
    },
    { 
      orderNo: 'ORD-1005', 
      orderDetails: 'Order #1005 - Coffee Maker', 
      storeName: 'Home Appliances',
      feedback: 'Pending', 
      orderInfo: 'Breville Barista Express'
    }
  ];

  reviews: FeedbackOrder[] = [
    { 
      orderNo: 'ORD-1003', 
      orderDetails: 'Order #1003 - Laptop Stand', 
      storeName: 'Office Supplies Co',
      feedback: 'Great seller! Fast delivery and excellent product quality.', 
      status: 'Published',
      orderInfo: 'Adjustable Aluminum Laptop Stand'
    },
    { 
      orderNo: 'ORD-1004', 
      orderDetails: 'Order #1004 - Gaming Mouse', 
      storeName: 'Tech Paradise',
      feedback: 'Perfect condition, exactly as described. Highly recommended!', 
      status: 'Published',
      orderInfo: 'Logitech G502 HERO Gaming Mouse'
    }
  ];

  filteredOrders: FeedbackOrder[] = [];
  filteredReviews: FeedbackOrder[] = [];

  constructor() {
    this.applyFilters();
  }

  setTab(tab: string) {
    this.selectedTab = tab;
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

private applyFilters() {
  const searchOrderTerm = this.searchOrderNo.toLowerCase();
  const searchProductTerm = this.searchProductName.toLowerCase(); 
       
  this.filteredOrders = this.ordersAwaitingFeedback.filter(order =>
    (!this.searchOrderNo || order.orderNo.toLowerCase().includes(searchOrderTerm)) &&
    (!this.searchProductName || order.orderInfo.toLowerCase().includes(searchProductTerm)) 
  );
       
  this.filteredReviews = this.reviews.filter(review =>
    (!this.searchOrderNo || review.orderNo.toLowerCase().includes(searchOrderTerm)) &&
    (!this.searchProductName || review.orderInfo.toLowerCase().includes(searchProductTerm)) 
  );
}

  editFeedback(orderNo: string) {
    console.log('Edit feedback for order:', orderNo);
  }

  deleteFeedback(orderNo: string) {
    console.log('Delete feedback for order:', orderNo);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Published':
        return 'published';
      case 'Pending':
        return 'pending';
      default:
        return '';
    }
  }

  getCurrentData(): FeedbackOrder[] {
    return this.selectedTab === 'orders' ? this.filteredOrders : this.filteredReviews;
  }
}