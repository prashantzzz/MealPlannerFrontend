import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true; // Allow access if authenticated
    }

    // Redirect to login page and pass returnUrl as query param
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
}
