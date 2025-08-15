import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module'; // adjust path as needed
import { MessagesNotificationService } from 'src/app/services/messagesNotification.services';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { forkJoin } from 'rxjs';
/** 
 * Interface to define the structure of a store object.
 */
interface Store {
  id: string;

  storeName: string;
  ownerFirstName: string;
  ownerSurname: string;
  emailAddress: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-followed-stores',
  standalone: true,
  imports: [SharedModule],
  providers: [MessagesNotificationService, MessageService],
  templateUrl: './followed-stores.component.html',
  styleUrls: ['./followed-stores.component.scss']
})

export class FollowedStoresComponent implements OnInit {
  stores: Store[] = [];             // Full list of stores from API
  filteredStores: Store[] = [];     // Filtered list for search
  loading: boolean = true;          // Loading state
  error: string = '';               // Error message
  searchTerm: string = '';          // Search input value

  defaultImg: string = 'https://via.placeholder.com/300x200?text=Store+Image';

  constructor(private http: HttpClient,
    private messagesNotificationService: MessagesNotificationService
    , private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.apiService.getFollowedStoreIds().subscribe({
      next: (ids: string[]) => {
        if (!ids.length) {
          this.stores = [];
          this.filteredStores = [];
          this.loading = false;
          return;
        }
        forkJoin(ids.map(id => this.apiService.getStoreById(id))).subscribe({
          next: (stores: any[]) => {
            this.stores = stores.map(s => s.result || s);
            this.filteredStores = [...this.stores];
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load store details';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Failed to load followed store IDs';
        this.loading = false;
      }
    });
  }

  /**
   * Filters the list of stores based on the user's search term.
   */
  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredStores = this.stores.filter(store =>
      store.storeName.toLowerCase().includes(term) ||
      store.ownerFirstName.toLowerCase().includes(term) ||
      store.ownerSurname.toLowerCase().includes(term) ||
      store.emailAddress.toLowerCase().includes(term)
    );

    this.messagesNotificationService.showErrorMessage('Error'); //
  }
}