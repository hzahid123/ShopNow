import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) { }

  private formatErrors(error: any) {
    return throwError(() => new Error(error.message || 'Server error'));
  }

  get<T>(
    path: string,
    params?: HttpParams,
    headers?: HttpHeaders,
    pagination?: { page: number; size: number }
  ): Observable<T> {

    if (!params) {
      params = new HttpParams();
    }

    if (pagination && pagination.page > 0) {
      params = params.append('PageNumber', pagination.page.toString());
      params = params.append('PageSize', pagination.size.toString());
    }

    return this.http
      .get<T>(path, { params, headers })
      .pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body: Object = {}, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(path, body, { headers })
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body: Object = {}, headers?: HttpHeaders): Observable<T> {
    return this.http
      .put<T>(path, body, { headers })
      .pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string, params: HttpParams = new HttpParams(), headers?: HttpHeaders): Observable<T> {
    return this.http
      .delete<T>(path, { params, headers })
      .pipe(catchError(this.formatErrors));
  }
}
