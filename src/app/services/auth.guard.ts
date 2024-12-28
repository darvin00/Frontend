import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    // If user is logged in
    if (this.authService.isLoggedIn()) {
      // Block access to 'login', 'signup', and 'toggle' routes
      if (url === '/login' || url === '/signup' || url === '/toggle') {
        this.router.navigate(['/shine/shinehome']); // Redirect to home or any logged-in page
        return false;
      }
      return true;
    } else {
      // If not logged in and trying to access protected pages
      if (url !== '/login' && url !== '/signup' && url !== '/toggle') {
        this.router.navigate(['/toggle']); // Redirect to login page
        return false;
      }
      return true;
    }
  }
}
