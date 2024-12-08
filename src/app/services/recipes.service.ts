import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private baseUrl = 'https://localhost:7081/api/recipes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllRecipes(): Observable<any> {
    return this.http.get(this.baseUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getRecipeById(id: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error fetching recipe:', error);
          return throwError(error);
        })
      );
  }

  createRecipe(recipe: any): Observable<any> {
    return this.http.post(this.baseUrl, recipe, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateRecipe(id: number, recipe: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, recipe, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    alert('Request failed: ' + (error.error?.message || error.message));
    throw error;
  }
}
