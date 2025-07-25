import { Component } from '@angular/core';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  imports: [SharedModule, PrimeSharedModule, CommonModule],
})
export class OverviewComponent {
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/100'
  };

  stats = [
    { label: 'Orders', value: 128, icon: 'pi pi-shopping-cart' },
    { label: 'Revenue', value: '$4,520', icon: 'pi pi-dollar' },
    { label: 'Reviews', value: 312, icon: 'pi pi-star' }
  ];

  recentActivities = [
    'New order placed by Alice',
    'Profile updated successfully',
    'Received 5-star review from a customer'
  ];
}
