import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    PrimeSharedModule
  ],
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {
  dataSource: any[] = [];
  displayedColumns: string[] = ['select', 'name', 'customerId', 'amount', 'orderId', 'status'];

  searchText: string = ''; // ✅ added this

  fullData: any[] = []; // ✅ this will keep unfiltered data

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
    console.log(`${item.name} selected `);
  } else {
    console.log(`${item.name} unselected `);
  }
}


  // ✅ Search handler
  loadRoles(searchText: string): void {
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
}
