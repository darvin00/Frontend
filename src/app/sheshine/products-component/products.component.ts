import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { SharedService } from '../../services/shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  loading = true; // Controls the spinner visibility
  filteredProducts: any[] = [];
  category: string | null = null;
  isFavorite: boolean = false;
  searchQuery: string = '';
  fallbackImage: string = 'assets/images/sheshineproduct/jewellaryaltimg.jpg';
  hoveredImage: { [key: number]: string | null } = {};
  userId: number | null = null; // Ensure userId is available
  // State variable to track button text changes for added products
  isProductAdding: { [key: number]: boolean } = {}; // Tracks "Adding..." state for each product
  isProductAdded: { [key: number]: boolean } = {}; // Tracks "Added Successfully" state for each product
  private favoritesUpdateInterval: any;
  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadUserIdFromLocalStorage(); // Load userId from local storage
    this.fetchProducts();
    // Check if the product is already in favorites after fetching details
    // if (this.userId) {
    //   this.checkIfFavorite(this.product.id);
    // }

    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category');

      this.applyFilters();
    });

    this.sharedService.currentSearchQuery.subscribe((query) => {
      this.searchQuery = query;
      this.applyFilters();
    });
     // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    }

    if (this.userId) {
      // Start the interval to fetch the user's favorites every second
      this.favoritesUpdateInterval = setInterval(() => {
        this.loadFavorites();
      }, 1000); // 1000 ms = 1 second
    } else {

    }
  }
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImage;
  }


  fetchProducts() {
    this.loading = true;
    this.http
      .get<any[]>('http://192.168.0.219:8080/api/products/json')
      .pipe(
        catchError(() => {
          this.loading = false;
          return of([]); // Handle error and return empty array if request fails
        })
      )
      .subscribe((data) => {
        this.products = data;
        this.loading = false; // Hide loading spinner once data is fetched
      });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.applyFilters();
    });

  }

  applyFilters(): void {
    const query = this.searchQuery ? this.searchQuery.toLowerCase().trim() : ''; // Handle undefined/null query
    const price = parseFloat(query);

    this.filteredProducts = this.products.filter((product) => {
      // Only include products where sheShine is true
      const matchesSheShine = product.sheShine === true;

      const matchesCategory = this.category
        ? product.category === this.category
        : true;

      // Safely handle product.name
      const matchesName = product.name
        ? product.name.toLowerCase().includes(query)
        : false;

      // Safely handle price comparison
      const matchesPrice = !isNaN(price) && product.price <= price;

      return matchesSheShine && matchesCategory && (matchesName || matchesPrice);
    });


  }



  toggleFavorite(product: any): void {
    if (!this.userId) {

      return;
    }

    product.isFavorite = !product.isFavorite;

    if (product.isFavorite) {
      // Add to favorites
      this.favoritesService.addFavorite(this.userId, product.id).subscribe(
        () => {

        },
        (error) => {


        }
      );
    } else {
      // Remove from favorites
      this.favoritesService.removeFavorite(this.userId, product.id).subscribe(
        () => {

        },
        (error) => {

        }
      );
    }
  }

  buyNow(product: any) {
    localStorage.setItem('productId', product.id); 
    this.router.navigate(['/sheshine/sheshineview'], {
      state: { productId: product.id }
    });
  }

  addToCart(product: any): void {
    product.quantity = 1;
    const userId = localStorage.getItem('userId');

    if (!userId) {


      // Handle redirection to the login page based on screen size
      this.breakpointObserver
        .observe([Breakpoints.Handset])
        .subscribe((result) => {
          if (result.matches) {
            // Route to login for mobile view
            this.router.navigate(['/login']);
          } else {
            // Route to login for tablet and laptop views
            this.router.navigate(['/toggle']);
          }
        });

      return;
    }

    const parsedUserId = parseInt(userId, 10);

    this.cartService
      .addOrUpdateCartItem(parsedUserId, product.id, product.quantity)
      .subscribe({
        next: (response) => {
          // Set the button to show "Added Successfully"
          this.isProductAdding[product.id] = false; // Hide "Adding..."
          this.isProductAdded[product.id] = true; // Show "Added Successfully"

          // Reset the "Added Successfully" state after 3 seconds
          setTimeout(() => {
            this.isProductAdded[product.id] = false;
          }, 3000); // Reset after 3 seconds

        },
        error: (error) => {

        },
      });
  }

  getStarClass(index: number, rating: number): string {
    if (rating >= index + 1) {
      return 'fa fa-star'; // filled star
    } else if (rating > index && rating < index + 1) {
      return 'fa fa-star-half-alt'; // half-filled star if you want
    } else {
      return 'fa fa-star-o'; // empty star
    }
  }
  // Load userId from local storage
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
  ngOnDestroy(): void {
    // Clean up the interval when the component is destroyed
    if (this.favoritesUpdateInterval) {
      clearInterval(this.favoritesUpdateInterval);
    }
  }

  loadFavorites(): void {
    if (!this.userId) {

      return;
    }



    this.favoritesService.getUserFavorites(this.userId).subscribe(
      (favorites: any[]) => {


        if (!this.products || this.products.length === 0) {

          return;
        }

        // Loop through the products and check if the product is in the favorites list
        this.products.forEach((product) => {

          const isFavorite = favorites.some((favorite) => favorite.id === product.id);
          if (isFavorite) {

            product.isFavorite = true;
          } else {

            product.isFavorite = false;
          }
        });
      },
      (error) => {

      }
    );
  }
  onMouseEnter(product: any) {
    this.setHoverImage(product);
}

onMouseLeave(product: any) {
    this.resetHoverImage(product);
}

onTouchStart(product: any) {
    this.setHoverImage(product);
}

onTouchEnd(product: any) {
    this.resetHoverImage(product);
}

private setHoverImage(product: any) {
    // Set the hovered image to the first image in the product.images array
    if (product.images && product.images.length > 0) {
        this.hoveredImage[product.id] = product.images[0];
    }
}

private resetHoverImage(product: any) {
    // Reset the hovered image back to null to show the original thumbnail
    this.hoveredImage[product.id] = null;
}

}
