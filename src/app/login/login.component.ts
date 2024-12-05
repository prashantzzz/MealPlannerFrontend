import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms'; // For two-way binding
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink // Enables routerLink in the template
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']); // Redirect to a dashboard or home page
        console.log('Login submitted:', { username: this.username, password: this.password });
      },
      error: (err) => alert('Invalid credentials')
    });
  }
}
