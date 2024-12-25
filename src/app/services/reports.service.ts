import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'https://localhost:7081/api';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Global error handler for API responses
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 403) {
      this.toastr.error('You are not authorized to access this resource.', 'Unauthorized Access');
    } else {
      const errorMessage = error.message || 'An unknown error occurred';
      this.toastr.error(errorMessage, `Error: ${error.status || 'Unknown'}`);
    }
    console.error('API Error:', error);
    return throwError(() => error);
  }

  // Method to delete all reports
  deleteAllReports(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/report`, { headers: this.getHeaders() }).pipe(
      map(() => {
        //this.toastr.success('All reports deleted successfully.', 'Success');
      }),
      catchError((error) => this.handleError(error))
    );
  }

  // Method to generate a single report row
  generateReport(reportData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/report`, reportData, { headers: this.getHeaders() }).pipe(
      map(() => {
        this.toastr.success('Report generated successfully.', 'Success');
      }),
      catchError((error) => this.handleError(error))
    );
  }

  // Fetch all reports data
  fetchReports(): Observable<any> {
    return forkJoin({
      users: this.http.get<any>(`${this.apiUrl}/users`, { headers: this.getHeaders() }),
      recipes: this.http.get<any>(`${this.apiUrl}/recipes`, { headers: this.getHeaders() }),
      reviews: this.http.get<any>(`${this.apiUrl}/reviews`, { headers: this.getHeaders() }),
      mealPlans: this.http.get<any>(`${this.apiUrl}/mealplans/all`, { headers: this.getHeaders() }),
      shoppingLists: this.http.get<any>(`${this.apiUrl}/shoppinglists`, { headers: this.getHeaders() }),
      dietaryPreferences: this.http.get<any>(`${this.apiUrl}/dietary-preferences/all`, { headers: this.getHeaders() }),
      mealPrep: this.http.get<any>(`${this.apiUrl}/mealprep`, { headers: this.getHeaders() })
    }).pipe(
      map((responses) => {
        this.toastr.success('Reports data generated successfully!', 'Success');
        return {
          userStatistics: this.processUserStatistics(responses.users.data),
          recipePopularity: this.processRecipePopularity(responses.recipes.data, responses.reviews.data),
          mealPlanUtilization: this.processMealPlanUtilization(responses.mealPlans.data),
          shoppingListStatus: this.processShoppingListStatus(responses.shoppingLists.data),
          dietaryPreferences: this.processDietaryPreferences(responses.dietaryPreferences.data),
          mealPreparationAnalysis: this.processMealPreparationAnalysis(responses.recipes.data, responses.mealPrep.data)
        };
      }),
      catchError((error) => this.handleError(error))
    );
  }

  // Process user statistics
  private processUserStatistics(users: any[]): any {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const roles = users.reduce((acc: any, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    return { totalUsers, activeUsers, roles };
  }

  // Process recipe popularity
  public processRecipePopularity(recipes: any[], reviews: any[]): any[] {
    interface ReviewData {
      totalReviews: number;
      totalRating: number;
    }

    const recipesWithId = recipes.map((recipe, index) => ({
      ...recipe,
      recipeId: index + 1,
    }));

    const recipeReviews: Record<number, ReviewData> = reviews.reduce((acc: Record<number, ReviewData>, review: any) => {
      if (!acc[review.recipeId]) {
        acc[review.recipeId] = { totalReviews: 0, totalRating: 0 };
      }
      acc[review.recipeId].totalReviews++;
      acc[review.recipeId].totalRating += review.rating;
      return acc;
    }, {});

    return recipesWithId
      .filter(recipe => recipeReviews[recipe.recipeId])
      .map(recipe => ({
        name: recipe.name,
        totalReviews: recipeReviews[recipe.recipeId].totalReviews,
        averageRating: recipeReviews[recipe.recipeId].totalRating / recipeReviews[recipe.recipeId].totalReviews,
      }))
      .sort((a, b) => b.averageRating - a.averageRating);
  }

  private processMealPlanUtilization(mealPlans: any[]): any {
    const totalMealPlans = mealPlans.length;
    const activeMealPlans = mealPlans.filter(mp => {
      const now = new Date();
      const startDate = new Date(mp.startDate);
      const endDate = new Date(mp.endDate);
      return startDate <= now && endDate >= now;
    }).length;

    const uniqueUsers = new Set(mealPlans.map(mp => mp.userId));
    return { totalMealPlans, activeMealPlans, usersWithMealPlans: uniqueUsers.size };
  }

  private processShoppingListStatus(shoppingLists: any[]): any {
    const totalIngredients = shoppingLists.length;
    const pendingItems = shoppingLists.filter(item => item.status === 'Pending').length;
    const completedItems = shoppingLists.filter(item => item.status === 'Purchased').length;

    return { totalIngredients, pendingItems, completedItems };
  }

  private processDietaryPreferences(preferences: any[]): any {
    const preferenceCounts = preferences.reduce((acc: Record<string, number>, pref: any) => {
      acc[pref.preferenceType] = (acc[pref.preferenceType] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(preferenceCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }

  private processMealPreparationAnalysis(recipes: any[], mealPrep: any[]): any {
    const avgPrepTimeByRecipe = recipes.map(recipe => {
      const relatedPreps = mealPrep.filter(mp => mp.recipeId === recipe.recipeId);
      const avgPrepTime = relatedPreps.reduce((sum, prep) => sum + prep.prepTime, 0) / (relatedPreps.length || 1);
      return { name: recipe.name, avgPrepTime };
    });

    const ingredientUsage = mealPrep.reduce((acc: Record<string, number>, prep: any) => {
      const ingredients: string[] = prep.ingredientsRequired
        .split(',')
        .map((ing: string) => ing.split(':')[0].trim());
      ingredients.forEach((ingredient: string) => {
        acc[ingredient] = (acc[ingredient] || 0) + 1;
      });
      return acc;
    }, {});

    const mostUsedIngredients = Object.entries(ingredientUsage)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { avgPrepTimeByRecipe, mostUsedIngredients };
  }
}
