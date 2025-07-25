import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://localhost:44311/api/TokenAuth/Authenticate'; // Change this URL if needed

  constructor(private http: HttpClient) {}

  authenticate(userNameOrEmailAddress: string, password: string, rememberMe: boolean): Observable<any> {
    const body = {
      userNameOrEmailAddress: userNameOrEmailAddress,
      password: password,
      rememberClient: rememberMe
    };
    return this.http.post(this.apiUrl, body);
  }
}
