import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MealPlanner';
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  logout(): void {
    this.authService.logout();
    this.checkAuthentication(); // Update authentication status
    this.router.navigate(['/login']); // Redirect to login page
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
}