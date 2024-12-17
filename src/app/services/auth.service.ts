import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7081/api/auth'; // Base URL of API
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password })
      .pipe(catchError((error) => this.handleError(error))); 
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/customer`, data)
      .pipe(catchError(this.handleError)); 
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  // getUserId(): number | null {
  //   return localStorage.getItem('userId');
  // }

  private handleError = (error: any): Observable<never> => {
    this.toastr.error(
      error.error?.message || error.message || 'An unexpected error occurred.',
      'Error'
    );
    return throwError(() => error);
  };

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token); 
  }
}
