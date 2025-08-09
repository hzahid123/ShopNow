import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'order-customer',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    PrimeSharedModule
  ],
  templateUrl: './order-customer.component.html',
  styleUrl: './order-customer.component.scss'
})
export class OrderCustomerComponent implements OnInit {
  dataSource: any[] = [];
  fullData: any[] = [];
  searchText: string = '';

  visible: boolean = false;
  filterVisible: boolean = false;
  calculatedRange: string | null = null;
  showCustomRange: boolean = false;

  filterForm: FormGroup = new FormGroup({
    range: new FormControl('last30'),
    start: new FormControl(null),
    end: new FormControl(null)
  });

  predefinedRanges = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7' },
    { label: 'Last 2 Weeks', value: 'last14' },
    { label: 'Last 30 Days', value: 'last30' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'Custom Range', value: 'custom' }
  ];

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    // Sample data — replace this with real API later
    this.fullData = [
      { orderId: 'ORD001', amount: 1200, status: 'Pending', checked: false },
      { orderId: 'ORD002', amount: 1800, status: 'Delivered', checked: false },
      { orderId: 'ORD003', amount: 900, status: 'Shipped', checked: false }
    ];

    this.dataSource = [...this.fullData];
  }

  onCheckboxChange(item: any): void {
    item.checked
      ? console.log(`${item.orderId} selected`)
      : console.log(`${item.orderId} unselected`);
  }

  loadOrders(searchText: string): void {
    if (!searchText?.trim()) {
      this.dataSource = [...this.fullData];
      return;
    }

    const lower = searchText.toLowerCase();

    this.dataSource = this.fullData.filter((item) =>
      item.orderId.toLowerCase().includes(lower) ||
      item.status.toLowerCase().includes(lower) ||
      item.amount.toString().includes(lower)
    );
  }

  onFilterClicked(): void {
    this.filterVisible = !this.filterVisible;
    console.log('Filter panel toggled');
    // Add logic to apply date range filter here later
  }
}
