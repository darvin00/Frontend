import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-kpnrunner',
  templateUrl: './kpnrunner.component.html',
  styleUrls: ['./kpnrunner.component.scss']
})
export class KpnrunnerComponent  {
   backgroundColor: string = '';
  animationDuration: string = '5s'; // Example duration

  constructor(private router: Router) {
    // Subscribe to router events to update background color on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setBackgroundColor();
    });

    // Initial background color setting
    this.setBackgroundColor();
  }

  setBackgroundColor() {
    const currentRoute = this.router.url;

    // Check if the current route includes the paths for SHINE or SHESHINE
    if (currentRoute.includes('/shine')) {
      this.backgroundColor = 'green'; // Background color for SHINE
    } else if (currentRoute.includes('/sheshine')) {
      this.backgroundColor = 'linear-gradient(111deg, rgb(153, 1, 91) 0%, rgb(0, 0, 0) 89%)'; // Background for SHESHINE
    } else {
      this.backgroundColor = ''; // Default background color if needed
    }
  }
}
