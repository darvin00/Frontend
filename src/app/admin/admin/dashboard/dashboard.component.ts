import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router: Router) {}
  logout() {
    // Remove the authentication token or flag from localStorage or wherever you store it
    localStorage.removeItem('adminToken');

    // Redirect to the admin login page
    this.router.navigate(['/admin']);
  }
}
