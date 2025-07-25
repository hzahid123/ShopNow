import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltip } from '@angular/material/tooltip';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';

interface ReturnRefund {
  orderNumber: string;
  storeName: string;
  status: 'In progress' | 'Awaiting returns';
  orderInfo: string;
  currentStatus: string;
}

@Component({
  selector: 'app-returns-refunds',
  templateUrl: './returns-refunds.component.html',
  styleUrls: ['./returns-refunds.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TooltipModule,
    MatTooltip,
    MatIconModule,
    MatChipsModule,
    TableModule,        // PrimeNG Table
    ButtonModule,       // PrimeNG Button
    InputTextModule,    // PrimeNG Input
    SharedModule,
    PrimeSharedModule
  ]
})
export class ReturnsRefundsComponent {
  inProgressCount = 0;
  awaitingReturnsCount = 0;

  searchFilters = {
    orderNumber: '',
    storeName: '',
    status: 'All'
  };

  statusOptions = ['All', 'In progress', 'Awaiting returns'];

  returnsRefunds: ReturnRefund[] = [
    {
      orderNumber: 'ORD-12345',
      storeName: 'Electronics World',
      status: 'In progress',
      orderInfo: 'Laptop Dell Inspiron 15',
      currentStatus: 'Return request submitted'
    },
    {
      orderNumber: 'ORD-12346',
      storeName: 'Fashion Hub',
      status: 'Awaiting returns',
      orderInfo: 'Nike Air Max Shoes',
      currentStatus: 'Waiting for package pickup'
    },
    {
      orderNumber: 'ORD-12347',
      storeName: 'Home & Garden',
      status: 'In progress',
      orderInfo: 'Kitchen Blender Set',
      currentStatus: 'Processing refund'
    }
  ];

  filteredReturnsRefunds: ReturnRefund[] = [];

  constructor() {
    this.updateCounts();
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  onClearFilters() {
    this.searchFilters = {
      orderNumber: '',
      storeName: '',
      status: 'All'
    };
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredReturnsRefunds = this.returnsRefunds.filter(item => {
      const matchesOrderNumber = !this.searchFilters.orderNumber ||
        item.orderNumber.toLowerCase().includes(this.searchFilters.orderNumber.toLowerCase());
      const matchesStoreName = !this.searchFilters.storeName ||
        item.storeName.toLowerCase().includes(this.searchFilters.storeName.toLowerCase());
      const matchesStatus = this.searchFilters.status === 'All' || item.status === this.searchFilters.status;

      return matchesOrderNumber && matchesStoreName && matchesStatus;
    });
  }

  changeTab(status: 'All' | 'In progress' | 'Awaiting returns') {
    this.searchFilters.status = status;
    this.applyFilters();
  }

  private updateCounts() {
    this.inProgressCount = this.returnsRefunds.filter(item => item.status === 'In progress').length;
    this.awaitingReturnsCount = this.returnsRefunds.filter(item => item.status === 'Awaiting returns').length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'In progress':
        return 'bg-light-warning text-warning';
      case 'Awaiting returns':
        return 'bg-light-success text-success';
      default:
        return 'bg-light-secondary text-muted';
    }
  }
}