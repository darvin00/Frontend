import { Component, OnInit } from '@angular/core';
import { ShineProductService } from '../services/shine-product.service';
import { CartItem, CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
@Component({
  selector: 'app-shineproducts',
  templateUrl: './shineproducts.component.html',
  styleUrls: ['./shineproducts.component.scss'],
})
export class ShineproductsComponent implements OnInit {
  loading = true;
  userId: number | null = null;
  isFavorite: boolean = false;
  products: any[] = []; // Array to hold all products
  filteredProducts: any[] = []; // Array to hold the filtered products
  // userId: number = 0; // Define a variable to store userId
  // State variable to track button text changes for added products
  isProductAdding: { [key: number]: boolean } = {}; // Tracks "Adding..." state for each product
  isProductAdded: { [key: number]: boolean } = {}; // Tracks "Added Successfully" state for each product
  private favoritesUpdateInterval: any;
  hoveredImage: { [key: number]: string | null } = {};
  fallbackImage: string = 'assets/images/shine/shineorganic.png';
  constructor(
    private productService: ShineProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.getAllProducts();
    this.loadUserId();
    this.fetchProducts();

    // Subscribe to search query changes
    this.sharedService.currentSearchQuery.subscribe((query) => {
      this.applyFilters(query);
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

  // Method to fetch all products
  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (data: any[]) => {
        this.products = data;

        this.filteredProducts = this.products; // Initialize filteredProducts with all products
      },
      (error) => {

      }
    );
  }

  applyFilters(query: string): void {
    const searchQuery = query ? query.toLowerCase().trim() : ''; // Handle undefined/null query

    if (searchQuery) {
      this.filteredProducts = this.products.filter((product) => {
        const productName = product.name ? product.name.toLowerCase() : ''; // Ensure it's a string
        const productPrice = product.price ? product.price.toString() : ''; // Ensure price is a string
        const matchesQuery = productName.includes(searchQuery) || productPrice.includes(searchQuery);

        // Only include products where shine is true
        const matchesShine = product.shine === true;

        return matchesShine && matchesQuery;
      });
    } else {
      // If no query, show all products where shine is true
      this.filteredProducts = this.products.filter((product) => product.shine === true);
    }


  }


  // Example methods for product interactions
  buyNow(product: any): void {
    localStorage.setItem('productId', product.id); 
    this.router.navigate(['/shine/shineview'], {
      state: { productId: product.id }
    });
  }
  addToCart(product: any): void {
    // Ensure the product quantity is set
    product.quantity = 1;

    // Retrieve userId from local storage
    const userId = localStorage.getItem('userId');

    if (userId) {
      // Parse userId and add product to cart
      const parsedUserId = parseInt(userId, 10);

      // Call the addOrUpdateCartItem method from CartService
      this.cartService
        .addOrUpdateCartItem(parsedUserId, product.id, product.quantity)
        .subscribe({
          next: () => {


            // Show "Added successfully" on the button for a few seconds
            this.isProductAdding[product.id] = false; // Hide "Adding..."
            this.isProductAdded[product.id] = true;
            setTimeout(() => {
              this.isProductAdded[product.id] = false;
            }, 3000); // Reset after 3 seconds

            // // Navigate to the cart page with product ID and quantity in query parameters
            // this.router.navigate(['/cart'], {
            //   queryParams: {
            //     id: product.id,
            //     quantity: product.quantity
            //   }
            // });
          },
          error: (error) => {

          },
        });
    } else {
      // If userId is not available, handle login redirection


      // Detect the screen size to route to the appropriate login page
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
    }
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
  private loadUserId() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = user.id; // Extract userId from the parsed object

      } catch (error) {

      }
    } else {

    }
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
