import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrimeSharedModule } from 'src/app/shared/PrimeShared.module';
import { ApiService } from 'src/app/services/api.service';
import { forkJoin } from 'rxjs'; 

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  sold: number;
  selected: boolean;
  addedToCart: boolean;
}
interface AddToCartRequest {
  "customerId": number;
  "productId": string;
  "quantity": number;
}
@Component({
  selector: 'wishlist',
  standalone: true,
  imports: [CommonModule, SharedModule, PrimeSharedModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  editMode = false;
  items: WishlistItem[] = [];
  loading = false;

 
  customerId = 6;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadWishlist();
  }

 loadWishlist() {
  this.loading = true;
  this.apiService.getWishlist(this.customerId).subscribe({
    next: (response) => {
      this.items = response.result.items;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading wishlist:', err);
      this.loading = false;
    },
  });
}


  get hasItems(): boolean {
    return this.items && this.items.length > 0;
  }

  get selectedItemsCount(): number {
    return this.items.filter((item) => item.selected).length;
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.items.forEach((item) => (item.selected = false));
    }
  }

addToCart(item: WishlistItem) {
  const addToCartData: AddToCartRequest = {
    "customerId": this.customerId,
    "productId": item.id,
    "quantity": 1 
  };

  this.apiService.addItemToCart(addToCartData).subscribe({
    next: (response) => {
      item.addedToCart = true;
      console.log('Item added to cart successfully');
    },
    error: (err) => {
      console.error('Error adding item to cart:', err);
    }
  });
}

  toggleSelectAll(event: any) {
    const isChecked = event.checked;
    this.items.forEach((item) => (item.selected = isChecked));
  }

  deleteSelected() {
    const selectedItems = this.items.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      return;
    }

    this.loading = true;

    
    const deleteRequests = selectedItems.map((item) =>
      this.apiService.removeFromWishlist(this.customerId, item.id.toString())
    );

    // Execute all delete requests in parallel
    Promise.all(deleteRequests.map(obs => obs.toPromise()))
      .then(() => {
        this.loadWishlist(); 
      })
      .catch((err) => {
        console.error('Error deleting selected items:', err);
        this.loading = false;
      });
  }

  deleteItem(item: WishlistItem) {
    this.loading = true;
    this.apiService.removeFromWishlist(this.customerId, item.id.toString()).subscribe({
      next: () => {
      
        this.loadWishlist();
      },
      error: (err) => {
        console.error('Error deleting item:', err);
        this.loading = false;
      },
    });
  }

  clearAll() {
    this.loading = true;
    this.apiService.clearWishlist(this.customerId).subscribe({
      next: () => {
        this.items = [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error clearing wishlist:', err);
        this.loading = false;
      },
    });
  }
}
