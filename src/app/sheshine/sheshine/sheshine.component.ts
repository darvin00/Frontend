import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sheshine',
  templateUrl: './sheshine.component.html',
  styleUrls: ['./sheshine.component.scss']
})
export class SheshineComponent implements OnInit {
  navbarOpen = false;
  previousScrollPosition: number = 0;
  navbarVisible: boolean = true;
  navbarOriginalPosition: boolean = true;

  // List of routes where the navbar should be hidden
  hiddenNavbarRoutes: string[] = ['/sheshine/view', '/another-route'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.previousScrollPosition = window.pageYOffset;
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    } else {
      navbarCollapse?.classList.add('show');
    }
  }

  closeNavbar() {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }

  // Listen to the window scroll event
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScrollPosition = window.pageYOffset;

    // Check if the current route should hide the navbar
    if (this.hiddenNavbarRoutes.includes(this.router.url)) {
      this.navbarVisible = false;
    } else {
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollPosition > this.previousScrollPosition && currentScrollPosition > 100) {
        this.navbarVisible = false; // Hide the navbar when scrolling down
        this.navbarOriginalPosition = false; // Navbar is no longer in its original position
      } else {
        this.navbarVisible = true; // Show the navbar when scrolling up
      }
    }

    // Check if we're back at the top of the page
    if (currentScrollPosition <= 0) {
      this.navbarOriginalPosition = true; // Navbar returns to its original position
    }

    this.previousScrollPosition = currentScrollPosition; // Update the previous scroll position-
  }
}
