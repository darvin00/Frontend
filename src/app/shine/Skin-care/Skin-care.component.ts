import { Component, OnInit } from '@angular/core';
import { ShineProductService } from '../services/shine-product.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FavoritesService } from '../../services/favorites.service';
@Component({
  selector: 'app-Skin-care',
  templateUrl: './Skin-care.component.html',
  styleUrls: ['./Skin-care.component.scss']
})
export class SkinCareComponent implements OnInit {
  loading = true;
  products: any[] = [];
   userId: number | null = null;
  isFavorite: boolean = false;
  fallbackImage: string = 'assets/images/shine/skincare/skincareproduct.avif';
  category: string = 'skin care';
  filteredProducts: any[] = [];
    isProductAdding: { [key: number]: boolean } = {}; // Tracks "Adding..." state for each product
  isProductAdded: { [key: number]: boolean } = {}; // Tracks "Added Successfully" state for each product
  private favoritesUpdateInterval: any;
  hoveredImage: { [key: number]: string | null } = {};

  constructor(
    private productService: ShineProductService,
    private cartService: CartService,
     private router: Router,
    private route: ActivatedRoute, private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
     private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.getProducts();
     // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    }


         // Subscribe to search query changes
    this.sharedService.currentSearchQuery.subscribe(query => {
      this.applyFilters(query);
    });

     if (this.userId) {
      // Start the interval to fetch the user's favorites every second
      this.favoritesUpdateInterval = setInterval(() => {
        this.loadFavorites();
      }, 1000); // 1000 ms = 1 second
    } else {

    }
  }

  ngOnDestroy(): void {
    // Clean up the interval when the component is destroyed
    if (this.favoritesUpdateInterval) {
      clearInterval(this.favoritesUpdateInterval);
    }
  } onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImage;
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


  getProducts(): void {
    this.productService.getProductsByCategory(this.category).subscribe(
      (data: any[]) => {
        this.products = data;

        if (this.products.length > 0) {
          // If products are found, assign them to filteredProducts
          this.filteredProducts = this.products;
        } else {
          // If no products are found, display a message or set a flag
          this.filteredProducts = []; // This ensures that the view shows the "No Products Found" message
          this.loading = false; // You can use this flag in your template to conditionally display the message
        }
      },
      (error) => {

        // Handle error case
        this.loading = true;
      }
    );
  }


 applyFilters(query: string) {
    const searchQuery = query.toLowerCase().trim();

    if (searchQuery) {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.price.toString().includes(searchQuery)
      );
    } else {
      this.filteredProducts = this.products;
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
  buyNow(product: any): void {
    localStorage.setItem('productId', product.id); 
    this.router.navigate(['/shine/shineview'], {
      state: { productId: product.id }
    });
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
