import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminauthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.isLoggedIn(); // Implement your logic to check if the admin is logged in

    if (!isAuthenticated) {
      this.router.navigate(['/admin']); // Redirect to login page if not authenticated
      return false;
    }
    return true;
  }

  private isLoggedIn(): boolean {
    // Replace this with your actual login check logic
    return !!localStorage.getItem('adminToken');
  }
}
