import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MealplansService } from '../services/mealplans.service';

@Component({
  selector: 'app-mealprep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mealplan.component.html',
  styleUrls: ['./mealplan.component.css'],
})
export class MealplanComponent implements OnInit {
  mealPlans: any[] = [];
  isAdminOrPlanner: boolean = false;
  isCustomer: boolean = false;
  apiUrl = 'https://localhost:7081/api/mealplans';
  newMealPlan = {
    startDate: '',
    endDate: '',
    mealType: '',
    recipeId: null,
    userId: null as number | null,
  };

  constructor(private http: HttpClient, private toastr: ToastrService, private mealplansService: MealplansService) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.fetchMealPlans();
  }

  checkUserRole(): void {
    const userRole = localStorage.getItem('role'); // Assuming role is stored in localStorage
    this.isAdminOrPlanner = userRole === 'Admin' || userRole === 'MealPlanner';
    this.isCustomer = userRole === 'Customer';
  }

  fetchMealPlans(): void {
    if (this.isAdminOrPlanner) {
      // Fetch all meal plans for Admin/MealPlanner
      this.mealplansService.getAllMealPlans().subscribe({
        next: (response) => {
          this.mealPlans = response.data;
          this.toastr.success('All meal plans loaded successfully!', 'Success');
        },
        error: () => {
          this.toastr.error('Error fetching all meal plans', 'Error');
        },
      });
    } else if (this.isCustomer) {
      // Fetch user-specific meal plans for Customer
      this.mealplansService.getMealPlans().subscribe({
        next: (response) => {
          this.mealPlans = response.data;
          this.toastr.success('Your meal plans loaded successfully!', 'Success');
        },
        error: () => {
          this.toastr.error('Error fetching your meal plans', 'Error');
        },
      });
    } else {
      this.toastr.error('Unauthorized role', 'Error');
    }
  }


  createMealPlan(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userid'); // Retrieve UserId from localStorage
  
    if (!token) {
      this.toastr.error('User not authenticated', 'Error');
      return;
    }
  
    if (!userId) {
      this.toastr.error('User ID not found. Please log in again.', 'Error');
      return;
    }
  
    // Assign UserId to the newMealPlan object
    this.newMealPlan = {
      ...this.newMealPlan,
      userId: +userId, // Ensuring UserId is passed and is a number
    };
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    this.http.post(this.apiUrl, this.newMealPlan, { headers }).subscribe({
      next: () => {
        this.toastr.success('Meal plan created successfully!', 'Success');
        this.fetchMealPlans(); // Refresh meal plans list
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating meal plan:', error);
        this.toastr.error('Error creating meal plan. Please check your inputs.', 'Error');
      },
    });
  }
  
  deleteMealPlan(id: number): void {
    if (confirm('Are you sure you want to delete this meal plan?')) {
      this.mealplansService.deleteMealPlan(id).subscribe({
        next: () => {
          this.toastr.success('Meal plan deleted successfully!', 'Success');
          this.fetchMealPlans(); // Refresh meal plans list
        },
        error: () => {
          this.toastr.error('Error deleting meal plan', 'Error');
        },
      });
    }
  }
  
  editMealPlan(plan: any): void {
    console.log('Updating Meal Plan with ID:', plan.mealPlanId); // Debugging
  
    this.newMealPlan = {
      startDate: plan.startDate,
      endDate: plan.endDate,
      mealType: plan.mealType,
      recipeId: plan.recipeId,
      userId: plan.userId,
    };
  
    this.mealplansService.updateMealPlan(plan.mealPlanId, this.newMealPlan).subscribe({
      next: () => {
        this.toastr.success('Meal plan updated successfully!', 'Success');
        this.resetForm();
        this.fetchMealPlans();
      },
      error: (error) => {
        console.error('Error updating meal plan:', error); // Log the response
        this.toastr.error('Error updating meal plan', 'Error');
      },
    });
  }
  
  
  resetForm(): void {
    this.newMealPlan = {
      startDate: '',
      endDate: '',
      mealType: '',
      recipeId: null,
      userId: null, 
    };
  }
}
