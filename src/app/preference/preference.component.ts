import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-preference',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css'],
})
export class PreferenceComponent implements OnInit {
  preferences: any[] = [];
  allPreferences: any[] = [];
  isAdminOrPlanner = false; // Flag to check if the user is Admin, Meal Planner, or Nutritionist
  isCustomer = false; // Flag to check if the user is a Customer
  isEditMode = false;
  currentPreference: any = { preferenceType: '', description: '' };
  newPreference = { preferenceType: '', description: '' };
  private apiUrl = 'https://localhost:7081/api/dietary-preferences';
  private allPreferencesUrl = 'https://localhost:7081/api/dietary-preferences/all';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.getPreferences();
  }

  checkUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (role === 'Admin' || role === 'MealPlanner' || role === 'Nutritionist') {
        this.isAdminOrPlanner = true;
        this.getAllPreferences(); // Fetch all preferences for Admin, MealPlanner, or Nutritionist
      } else {
        this.isCustomer = true;
        this.getPreferences(); // Fetch preferences for the customer (logged-in user)
      }
    } else {
      this.toastr.error('User not authenticated', 'Error'); // Error toast
    }
  }

  getPreferences(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('User not authenticated', 'Error'); // Error toast
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<{ message: string; data: any[] }>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        this.preferences = response.data; // Preferences for the logged-in user
      },
      error: () => this.toastr.error('Error fetching dietary preferences', 'Error'), // Error toast
    });
  }

  getAllPreferences(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('User not authenticated', 'Error'); // Error toast
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<{ message: string; data: any[] }>(this.allPreferencesUrl, { headers }).subscribe({
      next: (response) => {
        this.allPreferences = response.data; // All preferences for Admin, MealPlanner, or Nutritionist
      },
      error: () => this.toastr.error('Error fetching all dietary preferences', 'Error'), // Error toast
    });
  }

  createPreference(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('User not authenticated', 'Error'); // Error toast
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const userId = this.extractUserIdFromToken(token);

    const preference = {
      userId: userId,
      preferenceType: this.newPreference.preferenceType,
      description: this.newPreference.description,
    };

    this.http.post<{ message: string }>(this.apiUrl, preference, { headers }).subscribe({
      next: (response) => {
        this.toastr.success(response.message, 'Success'); // Success toast
        this.newPreference = { preferenceType: '', description: '' }; // Reset the form
        this.getPreferences(); // Refresh the list after successful creation
      },
      error: (error) => {
        console.error('Error creating preference:', error);
        this.toastr.error('Error creating dietary preference', 'Error'); // Error toast
      },
    });
  }

  extractUserIdFromToken(token: string): number {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.UserId;
  }

  editPreference(preference: any): void {
    this.isEditMode = true;
    this.currentPreference = { ...preference };
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('User not authenticated', 'Error'); // Error toast
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    if (this.isEditMode) {
      this.http
        .put(`${this.apiUrl}/${this.currentPreference.preferenceId}`, this.currentPreference, { headers })
        .subscribe({
          next: () => {
            this.toastr.success('Preference updated successfully', 'Success'); // Success toast
            this.getPreferences();
            this.resetForm();
          },
          error: () => this.toastr.error('Error updating preference', 'Error'), // Error toast
        });
    } else {
      this.http
        .post(this.apiUrl, this.currentPreference, { headers })
        .subscribe({
          next: () => {
            this.toastr.success('Preference created successfully', 'Success'); // Success toast
            this.getPreferences();
            this.resetForm();
          },
          error: () => this.toastr.error('Error creating preference', 'Error'), // Error toast
        });
    }
  }

  deletePreference(id: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('User not authenticated', 'Error'); // Error toast
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
      next: () => {
        this.toastr.success('Preference deleted successfully', 'Success'); // Success toast
        this.getPreferences();
      },
      error: () => this.toastr.error('Error deleting preference', 'Error'), // Error toast
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.currentPreference = { preferenceType: '', description: '' };
  }
}
