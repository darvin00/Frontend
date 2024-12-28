import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shine',
  templateUrl: './shine.component.html',
  styleUrls: ['./shine.component.scss']
})
export class ShineComponent implements OnInit {
   isNavbarOpen = false;

  previousScrollPosition: number = 0; // To track the last scroll position
  navbarVisible: boolean = true; // To control the visibility of the navbar
  navbarOriginalPosition: boolean = true; // To check if the navbar is at its original position

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.previousScrollPosition = window.pageYOffset; // Initialize scroll position
  }
  toggleNavbar() {

    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
      this.isNavbarOpen = false;
    } else {
      navbarCollapse?.classList.add('show');
      this.isNavbarOpen = true;
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

    // Hide navbar when scrolling down, show when scrolling up
    if (currentScrollPosition > this.previousScrollPosition && currentScrollPosition > 100) {
      this.navbarVisible = false; // Hide the navbar when scrolling down
      this.navbarOriginalPosition = false; // Navbar is no longer in its original position
    } else {
      this.navbarVisible = true; // Show the navbar when scrolling up
    }

    // Check if we're back at the top of the page
    if (currentScrollPosition <= 0) {
      this.navbarOriginalPosition = true; // Navbar returns to its original position
    }

    this.previousScrollPosition = currentScrollPosition; // Update the previous scroll position
  }
}
