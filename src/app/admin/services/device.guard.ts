import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DeviceGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const width = window.innerWidth;
    
    // Allow access only for laptop (e.g., screen width > 1024px)
    if (width > 1024) {
      return true;
    } else {
      alert('This page is accessible only on laptops.');
      this.router.navigate(['/']);
      return false;
    }
  }
}
