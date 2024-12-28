import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-WhatsAppButton',
  templateUrl: './WhatsAppButton.component.html',
  styleUrls: ['./WhatsAppButton.component.scss']
})
export class WhatsAppButtonComponent implements OnInit {
  whatsappLink: string;
  showButton = true; // Variable to control visibility

  // Define routes where the button should be hidden
  private hiddenRoutes: string[] = ['/login', '/signup', '/toggle','/dashboard/overview','/dashboard/product','/dashboard/order','/dashboard/order','/dashboard/report','/dashboard/adminreview','/dashboard/customer'];

  constructor(private router: Router) {
    const phoneNumber = '919791547470';
    const message = encodeURIComponent("Hello! I would like to know more about your services.");
    this.whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;
  }

  ngOnInit() {
    // Subscribe to router events to check route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is in the hiddenRoutes array
        this.showButton = !this.hiddenRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}
