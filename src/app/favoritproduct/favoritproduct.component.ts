import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../sheshine/services/product.service';
import { SharedService } from '../services/shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-favoritproduct',
  templateUrl: './favoritproduct.component.html',
  styleUrls: ['./favoritproduct.component.scss'],
})
export class FavoritproductComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  filteredProducts: Product[] = [];
  category: string | null = null;
  searchQuery: string = '';
  userId: number | null = null;
  isFavorite: boolean = false;


  isProductAdding: { [key: number]: boolean } = {};
  isProductAdded: { [key: number]: boolean } = {};
  isProductFavorite: { [key: number]: boolean } = {}; // Tracks favorite state

  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadUserIdFromLocalStorage();
    if (this.userId) {
      this.fetchUserFavorites();
    }

    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category');
      this.applyFilters();
    });

    this.sharedService.currentSearchQuery.subscribe((query) => {
      this.searchQuery = query;
      this.applyFilters();
    });
  }

  fetchUserFavorites() {
    this.loading = true;
    this.favoriteService.getUserFavorites(this.userId!).subscribe(
      (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;

        // Initialize favorite status
        data.forEach(product => this.isProductFavorite[product.id] = true);
      },
      (error) => {

        this.loading = false;
      }
    );
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const price = parseFloat(query);

    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory = this.category ? product.category === this.category : true;
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesPrice = !isNaN(price) && product.price <= price;
      return matchesCategory && (matchesName || matchesPrice);
    });
  }

  buyNow(product: any) {
    this.router.navigate(['/sheshine/view', product.id]);
  }

  addToCart(product: any): void {
    product.quantity = 1;
    const userId = localStorage.getItem('userId');

    if (!userId) {

      this.redirectToLogin();
      return;
    }

    const parsedUserId = parseInt(userId, 10);

    this.cartService.addOrUpdateCartItem(parsedUserId, product.id, product.quantity).subscribe({
      next: (response) => {
        this.isProductAdding[product.id] = false;
        this.isProductAdded[product.id] = true;
        setTimeout(() => {
          this.isProductAdded[product.id] = false;
        }, 3000);
      },
      error: (error) => {

      },
    });
  }

  // Remove a product from favorites
  removeFavorite(productId: number) {
    if (!this.userId) {

      return;
    }

    this.favoriteService.removeFavorite(this.userId, productId).subscribe({
      next: (response) => {

        this.isProductFavorite[productId] = false; // Update the favorite status
        this.filteredProducts = this.filteredProducts.filter(product => product.id !== productId);
      },
      error: (error) => {

      },
    });
  }

  loadUserIdFromLocalStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userId = user.id;

      } catch (error) {

      }
    } else {
     
    }
  }

  redirectToLogin() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      if (result.matches) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/toggle']);
      }
    });
  }

  getStarClass(index: number, rating: number): string {
    if (rating >= index + 1) {
      return 'fa fa-star';
    } else if (rating > index && rating < index + 1) {
      return 'fa fa-star-half-alt';
    } else {
      return 'fa fa-star-o';
    }
  }
}
