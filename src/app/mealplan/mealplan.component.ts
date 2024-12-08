import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-mealprep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mealplan.component.html',
  styleUrls: ['./mealplan.component.css'],
})
export class MealplanComponent implements OnInit {
  mealPlans: any[] = [];
  apiUrl = 'https://localhost:7081/api/mealplans';
  newMealPlan = {
    startDate: '',
    endDate: '',
    mealType: '',
    recipeId: null,
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getMealPlans();
  }

  getMealPlans(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<{ message: string; data: any[] }>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        this.mealPlans = response.data;
      },
      error: () => alert('Error fetching meal plans'),
    });
  }

  createMealPlan(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post(this.apiUrl, this.newMealPlan, { headers }).subscribe({
      next: () => {
        alert('Meal plan created successfully');
        this.getMealPlans(); // Refresh meal plans
      },
      error: () => alert('Error creating meal plan'),
    });
  }
}
