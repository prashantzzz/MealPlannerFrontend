import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7081/api/auth'; // Base URL of your API
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/customer`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token); // Ensure the result is boolean
  }
  
}
