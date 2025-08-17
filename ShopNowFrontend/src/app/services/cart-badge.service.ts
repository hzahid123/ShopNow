// cart-badge.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartBadgeService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private apiService: ApiService) {}

  /** Manually set the cart count */
  setCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }

  /** Reset cart count to 0 */
  resetCartCount(): void {
    this.cartCountSubject.next(0);
  }

  /** Get current cart count value */
  getCurrentCartCount(): number {
    return this.cartCountSubject.getValue();
  }

 
  fetchAndUpdateCartCount(): void {
    const customerId = Number(sessionStorage.getItem('customer_id'));

    if (!customerId) {
      this.resetCartCount();
      return;
    }

    this.apiService.getCartSummary(customerId)
      .pipe(
        catchError((err) => {
          console.error('Cart fetch failed:', err);
          this.resetCartCount();
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.result?.cartItems) {
          const totalQty = response.result.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
          this.setCartCount(totalQty);
        } else {
          this.resetCartCount();
        }
      });
  }
}
