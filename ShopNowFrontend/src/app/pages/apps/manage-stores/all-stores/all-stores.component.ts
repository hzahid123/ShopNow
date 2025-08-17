// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { SharedModule } from 'src/app/shared/shared.module'; // adjust path as needed
// import { MessagesNotificationService } from 'src/app/services/messagesNotification.services';
// import { MessageService } from 'primeng/api';
// import { ApiService } from 'src/app/services/api.service';

// interface Store {
//   id: string;

//   storeName: string;
//   ownerFirstName: string;
//   ownerSurname: string;
//   emailAddress: string;
//   imageUrl?: string;
// }

// @Component({
//   selector: 'app-all-stores',
//   standalone: true,
//   imports: [SharedModule],
//   providers: [MessagesNotificationService,MessageService],
//   templateUrl: './all-stores.component.html',
//   styleUrls: ['./all-stores.component.scss']
// })
// export class YourComponent implements OnInit {
//   shops: any[] = [];
//   loading = false;
//   error = '';

//   constructor(private apiService: ApiService) {}

//   ngOnInit() {
//     this.loadShops();
//   }

//   loadShops(keyword: string = '') {
//     this.loading = true;
//     this.apiService.getShops(keyword).subscribe({
//       next: (data) => {
//         // Adjust this based on your API response structure
//         this.shops = data?.result?.items || data?.items || [];
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load shops';
//         this.loading = false;
//       }
    


//   /**
//    * Filters the list of stores based on the user's search term.
//    */
//   onSearchChange(): void {
//     const term = this.searchTerm.toLowerCase();
//     this.filteredStores = this.stores.filter(store =>
//       store.storeName.toLowerCase().includes(term) ||
//       store.ownerFirstName.toLowerCase().includes(term) ||
//       store.ownerSurname.toLowerCase().includes(term) ||
//       store.emailAddress.toLowerCase().includes(term)
//     );

//     this.messagesNotificationService.showErrorMessage('Error'); // <-- use injected property
//   }
// }



import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module'; // adjust path as needed
import { MessagesNotificationService } from 'src/app/services/messagesNotification.services';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';

interface Store {
  id: string;
  storeName: string;
  ownerFirstName: string;
  ownerSurname: string;
  emailAddress: string;
  imageUrl?: string;
}

// ...existing imports...

@Component({
  selector: 'app-all-stores',
  standalone: true,
  imports: [SharedModule],
  providers: [MessagesNotificationService, MessageService],
  templateUrl: './all-stores.component.html',
  styleUrls: ['./all-stores.component.scss']
})
export class AllStoresComponent implements OnInit {
  shops: Store[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  defaultImg = 'assets/images/default-store.png'; // <-- Add your default image path

  constructor(
    private apiService: ApiService,
    private messagesNotificationService: MessagesNotificationService
  ) {}

  ngOnInit() {
    this.loadShops();
  }

  loadShops(keyword: string = '') {
    this.loading = true;
    this.apiService.getShops(keyword).subscribe({
      next: (data) => {
        this.shops = data?.result?.items || data?.items || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load shops';
        this.loading = false;
        this.messagesNotificationService.showErrorMessage('Error loading shops');
      }
    });
  }

  onSearchChange(): void {
    this.loadShops(this.searchTerm);
  }
}