import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    PrimeSharedModule,
    FormsModule
  ],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {
  dataSource: any[] = [];
  displayedColumns: string[] = ['select', 'name', 'customerId', 'amount', 'orderId', 'status'];

  searchText: string = '';
  fullData: any[] = [];

  // Filter dialog state and form
  filterVisible: boolean = false;
  filterForm: FormGroup;
  predefinedRanges = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Custom', value: 'custom' }
  ];
  showCustomRange: boolean = false;
  calculatedRange: string = '';

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      range: [''],
      start: [''],
      end: ['']
    });
  }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.fullData = [
      {
        name: 'Item A',
        customerId: 'C001',
        amount: 1200,
        orderId: 'ORD001',
        status: 'Pending'
      },
      {
        name: 'Item B',
        customerId: 'C002',
        amount: 1800,
        orderId: 'ORD002',
        status: 'Delivered'
      },
      {
        name: 'Item C',
        customerId: 'C003',
        amount: 900,
        orderId: 'ORD003',
        status: 'Shipped'
      }
    ];

    this.dataSource = [...this.fullData];
  }

  onCheckboxChange(item: any): void {
    if (item.checked) {
      console.log(`${item.name} selected`);
    } else {
      console.log(`${item.name} unselected`);
    }
  }

  // Search handler
  onSearch(): void {
    this.filterOrders(this.searchText);
  }

  filterOrders(searchText: string): void {
    if (!searchText || searchText.trim() === '') {
      this.dataSource = [...this.fullData];
      return;
    }

    const lower = searchText.toLowerCase();
    this.dataSource = this.fullData.filter(item =>
      item.name.toLowerCase().includes(lower) ||
      item.customerId.toLowerCase().includes(lower) ||
      item.orderId.toLowerCase().includes(lower) ||
      item.status.toLowerCase().includes(lower)
    );
  }

  // Filter dialog logic
  onRangeChange(value: string): void {
    this.showCustomRange = value === 'custom';
    if (!this.showCustomRange) {
      this.filterForm.patchValue({ start: '', end: '' });
      this.calculatedRange = this.predefinedRanges.find(r => r.value === value)?.label || '';
    } else {
      this.calculatedRange = '';
    }
  }

  cancelFilter(): void {
    this.filterVisible = false;
    this.filterForm.reset();
    this.showCustomRange = false;
    this.calculatedRange = '';
  }

  applyFilter(): void {
    // Example: just close the dialog and show the selected range
    const { range, start, end } = this.filterForm.value;
    if (range === 'custom' && start && end) {
      this.calculatedRange = `${start} - ${end}`;
    } else {
      this.calculatedRange = this.predefinedRanges.find(r => r.value === range)?.label || '';
    }
    this.filterVisible = false;
    // You can implement actual filtering logic here based on the selected range
  }
}