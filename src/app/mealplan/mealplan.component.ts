import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getMealPlans();
  }

  getMealPlans(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('User not authenticated', 'Error');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<{ message: string; data: any[] }>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        this.mealPlans = response.data;
        this.toastr.success('Meal plans loaded successfully!', 'Success');
      },
      error: () => {
        this.toastr.error('Error fetching meal plans', 'Error');
      },
    });
  }

  createMealPlan(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('User not authenticated', 'Error');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post(this.apiUrl, this.newMealPlan, { headers }).subscribe({
      next: () => {
        this.toastr.success('Meal plan created successfully', 'Success');
        this.getMealPlans(); // Refresh meal plans
        this.resetForm();
      },
      error: () => {
        this.toastr.error('Error creating meal plan', 'Error');
      },
    });
  }

  resetForm(): void {
    this.newMealPlan = {
      startDate: '',
      endDate: '',
      mealType: '',
      recipeId: null,
    };
  }
}
