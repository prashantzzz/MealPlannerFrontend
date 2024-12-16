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
  isAdmin: boolean = false;
  menuOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.checkAdminRole();
  }

  logout(): void {
    this.authService.logout();
    this.checkAuthentication();
    this.router.navigate(['/login']);
  }

  checkAdminRole(): void {
    const role = this.authService.getRole();
    this.isAdmin = role === 'Admin';
  }

  checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen; // Toggle the menu open state
  }
}
