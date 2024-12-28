import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShineProductService } from '../services/shine-product.service';
import { CartService } from '../../services/cart.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FavoritesService } from '../../services/favorites.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-pick-product',
  templateUrl: './pick-product.component.html',
  styleUrls: ['./pick-product.component.scss']
})
export class PickProductComponent implements OnInit {
  userId: number | null = null;
  isFavorite: boolean = false;
  fallbackImage: string = 'assets/images/shine/homepageshine.jpg';
  products: any[] = [];  // Array to hold all products
  filteredProducts: any[] = [];  // Array to hold the filtered products
  searchQuery: string = '';  // Search query for filtering
    // State variable to track button text changes for added products
  isProductAdding: { [key: number]: boolean } = {}; // Tracks "Adding..." state for each product
  isProductAdded: { [key: number]: boolean } = {}; // Tracks "Added Successfully"
  private favoritesUpdateInterval: any;
  hoveredImage: { [key: number]: string | null } = {};

  // New variables for controlling the number of visible rows
  rowsToShow: number = 2;  // Number of rows to display initially
  itemsPerRow: number = 4; // Number of products per row (depends on your layout)
  showAllProducts: boolean = false; // Flag to toggle between showing all or limited rows

  constructor(private productService: ShineProductService, private cartService: CartService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.getAllProducts();  // Fetch all products on component initialization

    // Check if the code is running in the browser
    if (isPlatformBrowser(this.platformId)) {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        this.userId = parseInt(storedUserId, 10);
      }
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

  // Method to fetch all products
  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (data: any[]) => {
        this.products = data;  // Assign the fetched products to the products array
        this.applyFilters();  // Apply filters after fetching products
      },
      (error) => {

      }
    );
  }

  // Method to apply filters based on search query
  applyFilters() {
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.price.toString().includes(query)
      );
    } else {
      this.filteredProducts = this.products;  // If no query, show all products
    }
  }

  // Toggle visibility of all products
  toggleViewMore() {
    this.showAllProducts = !this.showAllProducts;
  }

  // Determine the number of products to display
  getDisplayedProducts() {
    if (this.showAllProducts) {
      return this.filteredProducts;
    } else {
      return this.filteredProducts.slice(0, this.rowsToShow * this.itemsPerRow);
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
      this.cartService.addOrUpdateCartItem(parsedUserId, product.id, product.quantity)
        .subscribe({
          next: () => {


            // Set the button to show "Added Successfully"
            this.isProductAdding[product.id] = false; // Hide "Adding..."
            this.isProductAdded[product.id] = true; // Show "Added Successfully"

            // Reset the "Added Successfully" state after 3 seconds
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

          }
        });
    } else {
      // If userId is not available, handle login redirection


      // Detect the screen size to route to the appropriate login page
      this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
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
