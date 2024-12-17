import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealplansService {
  private baseUrl = 'https://localhost:7081/api/mealplans';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Fetch meal plans for the current user (Customer role)
  getMealPlans(): Observable<any> {
    return this.http.get(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  // Fetch all meal plans (Admin or MealPlanner role)
  getAllMealPlans(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }

  deleteMealPlan(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  
  updateMealPlan(id: number, mealPlan: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, mealPlan, { headers: this.getAuthHeaders() });
  }
  
}
