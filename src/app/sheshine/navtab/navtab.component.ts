import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SharedService } from '../../services/shared.service';
import { User } from '../../services/user-profile.model';
import { UserService } from '../../services/user-profile.service';
import { NavbarService } from '../services/navbar.service';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-navtab',
  templateUrl: './navtab.component.html',
  styleUrls: ['./navtab.component.scss']
})
export class NavtabComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  cartCount: number = 0;
  showNavbar: boolean = true;
  showKpnRunner: boolean = true;
  userId: number | null = null;
  user: User | null = null;
  userProfile: any;
  private alive = true;  // Used to manage Observable lifetime



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private sharedService: SharedService,
    private userService: UserService,
    private navbarService: NavbarService
  ) {}

  ngOnInit(): void {
    this.initializeUser();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbarVisibility(event.url);
      }
    });

    // Cart count polling every second
    if (this.userId) {
      interval(1000)
        .pipe(takeWhile(() => this.alive))
        .subscribe(() => this.loadCartCount());
    }
  }

  private initializeUser(): void {
    const user = this.getUserFromLocalStorage();
    if (user) {
      this.userId = user.id;
      this.user = user;
      this.fetchUserProfile(user.email);
      interval(5000) // Poll every 5 seconds
        .pipe(takeWhile(() => this.alive))
        .subscribe(() => this.fetchUserProfile(user.email));
    } else {

    }
  }

 private getUserFromLocalStorage(): any {
    if (typeof window !== 'undefined' && localStorage) {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    return null;
}

  private updateNavbarVisibility(url: string): void {
    const hiddenRoutes = ['/address', '/payment', '/cart', '/login', '/signup', '/toggle', '/sheshine/view','/shine/view', '/admin', '/dashboard/overview', '/dashboard/product', '/dashboard/order', '/dashboard/customer', '/dashboard/report','/dashboard/shineproductadd','/forgotpassword','/resetpassword'];
    this.showNavbar = !hiddenRoutes.some(route => url.includes(route));

    const kpnRunnerHiddenRoutes = ['/login', '/signup', '/toggle', '/admin', '/dashboard/overview', '/dashboard/product', '/dashboard/order', '/dashboard/customer', '/dashboard/report','/dashboard/shineproductadd','/forgotpassword','/resetpassword'];
    this.showKpnRunner = !kpnRunnerHiddenRoutes.some(route => url.includes(route));
  }

  private loadCartCount(): void {
    if (this.userId !== null) {
      this.navbarService.getCartCount(this.userId).subscribe(
        (count: number) => {
          this.cartCount = count;
          
        },

      );
    }
  }

  private fetchUserProfile(email: string): void {
    this.userService.getUserProfileByEmail(email).subscribe(
      response => {
        this.userProfile = response;
      },

    );
  }

   onProduct(): void {
    const currentRoute = this.router.url.split('?')[0];


    if (currentRoute === '/shine/shinehome') {

      this.router.navigate(['/shine/shineproducts'], { queryParams: { search: this.searchQuery } });
    } else if (currentRoute === '/sheshine/home') {

      this.router.navigate(['/sheshine/products'], { queryParams: { search: this.searchQuery } });
    } else {

      this.router.navigate([], {
        queryParams: { search: this.searchQuery },
        relativeTo: this.route
      });
    }
  }

  onSearchChange(): void {
    this.sharedService.changeSearchQuery(this.searchQuery);
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  signOut(): void {
    this.userService.signOut();
    localStorage.clear();
    this.user = null;

    const targetRoute = window.innerWidth <= 767 ? '/login' : '/toggle';
    this.router.navigate([targetRoute]);
  }

  ngOnDestroy(): void {
    this.alive = false;  // Unsubscribe from Observables
  }
}
