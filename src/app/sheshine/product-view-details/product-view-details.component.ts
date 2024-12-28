import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../../services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrls: ['./product-view-details.component.scss'],
})
export class ProductViewDetailsComponent implements OnInit {
  product: any;
  loading = true;
  isFavorite: boolean = false;
  cartItems: CartItem[] = [];
  userId: number | null = null;
  quantity: number = 1; // Initialize quantity to 1
  productDetails: any;
  reviewText: string = '';
  reviews: string[] = [];
  private favoritesUpdateInterval: any;
  isAddingToCart: boolean = false; // Loading state for adding to cart

  colors: string[] = [
    '#000',
    '#EDEDED',
    '#D5D6D8',
    '#EFE0DE',
    '#AB8ED1',
    '#F04D44',
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {

    this.fetchProducts();

    const state = history.state;  // Access the navigation state
const productId = state.productId;  // Retrieve the productId from the state



const storedProductId = localStorage.getItem('productId');  // Retrieve the productId from localStorage
if (storedProductId) {
  const productId = storedProductId;  // Assign the retrieved productId
  console.log('Stored Product ID:', productId);
  // You can now use the productId in your logic
}
const id = Number(localStorage.getItem('productId'));
    // Fetch the product details using the product ID
    this.productService.getProductById(id).subscribe({

      next: (product) => {
        this.product = product;



        if (
          this.product &&
          (typeof this.product.quantity !== 'number' ||
            isNaN(this.product.quantity))
        ) {
          this.product.quantity = 1;
        }

        // Check if the product is already in favorites after fetching details
        if (this.userId) {
          this.checkIfFavorite(this.product.id);
        }
      },
      error: (err) => {

      },
    });

    // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    }

    if (this.userId) {
      // Fetch the user's favorite products
      this.loadFavorites();
    } else {

    }


    if (this.userId) {
      // Start the interval to fetch the user's favorites every second
      this.favoritesUpdateInterval = setInterval(() => {
        this.loadFavorites();
      }, 1000); // 1000 ms = 1 second
    } else {

    }
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


loadFavorites(): void {
  if (!this.userId) {

    return;
  }

  this.favoritesService.getUserFavorites(this.userId).subscribe(
    (favorites: any[]) => {


      if (this.product) {
        this.isFavorite = favorites.some((favorite) => favorite.id === this.product.id);
          this.product.isFavorite = this.isFavorite;

      }
    },
    (error) => {

    }
  );
}

    ngOnDestroy(): void {
    // Clean up the interval when the component is destroyed
    if (this.favoritesUpdateInterval) {
      clearInterval(this.favoritesUpdateInterval);
    }
  }


  checkIfFavorite(productId: number): void {
    this.favoritesService
      .getUserFavorites(this.userId!)
      .subscribe((favorites: any[]) => {
        const favoriteProduct = favorites.find(
          (favorite) => favorite.id === productId
        );
        this.isFavorite = !!favoriteProduct;
      });
  }

 fetchProducts() {
  this.loading = true;

  // Show the loader after a 3-second delay
  setTimeout(() => {
    this.loading = true;
  }, 3000);

  this.http
    .get<any[]>('http://192.168.0.219:8080/api/products/json')
    .pipe(
      catchError(() => {
        this.loading = false;
        return of([]); // Handle error and return empty array if request fails

      })
    )
    .subscribe((data) => {
      this.product = data;
      this.loading = false; // Hide the loading spinner once the data is fetched
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

  // Increase quantity with stock check and optional max limit
  increaseQuantity() {
    if (!this.product) {

      return;
    }

    // Assuming product.stock represents the available quantity
    const maxStock = this.product.stockQuantity || 20; // Default stock limit if not provided

    if (this.quantity < maxStock) {
      this.quantity++;
      this.product.quantity = this.quantity;

    } else {

      alert('Maximum stock limit reached.');
    }
  }
  // Decrease quantity, ensuring it does not go below 1
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.product.quantity = this.quantity;

    } else {

    }
  }

  addToCart(product: any): void {
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
     this.isAddingToCart = true; // Start loading state

    this.cartService
      .addOrUpdateCartItem(parsedUserId, product.id, product.quantity)
      .subscribe({
        next: (response) => {

          this.isAddingToCart = false; // End loading state
        this.router.navigate(['/cart']); // Redirect to cart page after successful addition

        },
        error: (error) => {

           this.isAddingToCart = false; // End loading state on error
        },
      });
  }
  buyNow(id: number): void {
    if (this.product) {
      // Use the current quantity from the product object or the quantity property
      const currentQuantity = this.quantity; // or this.product.quantity



      // Check if user is logged in
      if (this.authService.isLoggedIn()) {
        // User is logged in, proceed to address list
        const navigationExtras: NavigationExtras = {
          state: {
            ids: [this.product.id], // Pass the product ID in an array
            quantities: [currentQuantity], // Pass the updated quantity in an array
          },
        };

        this.router
          .navigate(['/address-list'], navigationExtras)
          .then((success) => {
            if (success) {

            } else {

            }
          });
      } else {
        // User is not logged in, detect the device type
        const isMobile = window.innerWidth <= 768; // Adjust this value based on your mobile breakpoint

        if (isMobile) {
          // On mobile view, route directly to login page
          this.router.navigate(['/login']).then((success) => {
            if (success) {

            } else {

            }
          });
        } else {
          // On laptop/tablet view, route to the toggle component (login/signup)
          this.router.navigate(['/toggle']).then((success) => {
            if (success) {

            } else {

            }
          });
        }
      }
    }
  }

  submitReview() {
    if (this.reviewText.trim()) {
      this.reviews.unshift(this.reviewText);

      this.reviewText = '';
    } else {
      alert('Review cannot be empty.');
    }
  }

  changeImage(image: string) {
    this.product.thumbnail = image;
  }

  // getStarClass(index: number, rating: number): string {
  //   if (index < rating) {
  //     return 'fas fa-star';
  //   } else if (index < Math.ceil(rating) && rating % 1 !== 0) {
  //     return 'fas fa-star-half-alt';
  //   } else {
  //     return 'far fa-star';
  //   }
  // }

  setRating(product: any, rating: number): void {
    product.averageRating = rating;
  }

  activeSections: boolean[] = [false, false, false, false];

  toggleContent(index: number): void {
    this.activeSections[index] = !this.activeSections[index];
  }

  isActive(index: number): boolean {
    return this.activeSections[index];
  }

  getClass(index: number): string {
    return this.isActive(index) ? 'collapsible active' : 'collapsible';
  }
}
