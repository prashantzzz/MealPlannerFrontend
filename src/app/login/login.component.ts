import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms'; // For two-way binding
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppComponent } from '../app.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private appComponent: AppComponent,
    private toastr: ToastrService
  ) {}

  /**
   * works when login is clicked
   * @param null
   * @returns void
   * @version 10.1 latest
   */
  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        const { token } = response; // Extract token object
        localStorage.setItem('token', token.token); // Store JWT token
        localStorage.setItem('role', token.role);   // Store role
        localStorage.setItem('username', token.username); //store username
        this.appComponent.checkAuthentication();    // Update UI state
        this.toastr.success('Logged in successfully!', 'Success'); // Success toastr
        this.router.navigate(['/dashboard']);       // Navigate to dashboard
      },
      error: (error) => {
        this.toastr.error(error.error?.message || error.message || 'An unexpected error occurred.',
          'Error'); // Error toastr
      }
    });
  }
  
}
