import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://localhost:44311/api/services/app/Product';

  constructor(private http: HttpClient) {}

  createProduct(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create`, payload);
  }
  
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAllProducts`);
  }

    // In your ProductService
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Delete?id=${id}`);
  }

  editProduct( payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Update`, payload);
  }

}
