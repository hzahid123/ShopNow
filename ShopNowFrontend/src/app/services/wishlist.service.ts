// src/app/services/wishlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  
  wishlistIds = new BehaviorSubject<string[]>([]);
  wishlistIds$ = this.wishlistIds.asObservable();

  constructor(private apiService: ApiService) {
    this.loadWishlist();
  }

  public loadWishlist(): void {
    this.apiService.getMyWishlist().subscribe({
      next: (res: any) => {
        const ids = res?.result?.map((item: any) => String(item.id)) || [];
        this.wishlistIds.next(ids);
      },
      error: (err) => {
        console.error('Wishlist load error:', err);
        this.wishlistIds.next([]);
      }
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds.value.includes(String(productId));
  }
}