import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ActivatedRoute, NavigationExtras, NavigationStart, Router } from '@angular/router';
import { ProductService } from '../sheshine/services/product.service';
import { CartItem } from '../services/cart.service'; // Import CartItem interface
import { Product } from '../admin/services/product.model';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { Location } from '@angular/common'; // Step 1: Import Location

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = []; // Use CartItem interface
  totalAmount: number = 0;
  cartItemCount: number = 0;
   removeMessage: string | null = null;
  product: any;
  userId: number | null = null;
  totalProductCount: number = 0;
  private cartRefreshInterval: any;
  isLoading: boolean = true;





  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private sharedService: SharedService,
      private location: Location

  ) {}

  ngOnInit() {
    // Retrieve userId from local storage
    this.loadUserIdFromLocalStorage();

    // Fetch cart items only if userId is available
    if (this.userId !== null) {

      this.getCartItems();


    } else {

    }

    // Fetch product details if an ID is present in the route
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.productService.getProducts().subscribe(products => {
        this.product = products.find(p => p.id === id);

      });
    }
    this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      // Save the current URL before navigating to the new route
      sessionStorage.setItem('previousPage', this.router.url);
    }
  });
  }

goBack() {
  const previousPage = sessionStorage.getItem('previousPage');
  if (previousPage) {
    this.router.navigate(['/sheshine/home']);
  } else {
    this.router.navigate(['/shine/home']); // Fallback to "shine/home" if no previous page is found
  }
}




  // Load userId from local storage
  loadUserIdFromLocalStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userId = user.id; // Extract userId from parsed user data

      } catch (error) {

      }
    } else {

    }
  }


  getCartItems(): void {


    if (this.userId !== null) {
      this.cartService.getCartItems(this.userId).subscribe({
        next: (items) => {
          // Only log and update if there’s a change in items
          if (this.cartItems !== items) {

            this.cartItems = items;
            this.cartItemCount = items.length;
             this.isLoading = false; // Set to false once data is loaded

            // Update shared cart count only if count has changed
            this.sharedService.updateCartCount(this.cartItemCount);

            // Recalculate total amount and log it
            this.calculateTotalAmount();

          }
        },
        error: (error) => {

        }
      });
    } else {

    }
  }


  // Method to calculate the total amount in the cart based on quantity
calculateTotalAmount() {
  this.totalAmount = this.cartItems.reduce((acc, item) => {
    // Check if item and item.price are defined
    if (item && item.product.price != null) {
      return acc + parseFloat(item.product.price.toString()) * (item.quantity || 1);
    } else {

      return acc; // Skip the item with undefined price
    }
  }, 0);

}
removeFromCart(item: CartItem) {
  this.cartService.removeCartItem(item.id).subscribe(() => {
    // Remove the item from the cartItems array
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);

    // Recalculate the total amount after removal
    this.calculateTotalAmount();

    // Update the cart item count
    this.cartItemCount = this.cartItems.length;

    // Check if totalAmount is 0, then navigate back
    if (this.totalAmount === 0) {

      this.location.back(); // Navigate to the previous page
      return; // Exit the method if the cart is empty
    }

    // Set the message to show
    this.removeMessage = 'Product was removed from the cart';

    // Clear the message after 2 seconds
    setTimeout(() => {
      this.removeMessage = null; // Clear the message
    }, 2000); // Display for 2 seconds


  }, error => {

  });
}

// Method to handle the "Buy Now" action for all items
buyAll() {
  // Check if user is logged in
  if (this.authService.isLoggedIn()) {
    if (this.cartItems.length > 0) {
      const productIds = this.cartItems.map(item => item.product.id);
      const quantities = this.cartItems.map(item => item.quantity || 1);



      // Create NavigationExtras to pass state
      const navigationExtras: NavigationExtras = {
        state: {
          ids: productIds,
          quantities: quantities
        }
      };
      sessionStorage.setItem('previousPage', this.router.url);

      // Navigate to the address-list component with state
      this.router.navigate(['/address-list'], navigationExtras).then(success => {
        if (success) {


        } else {

        }
      }).catch(error => {

      });
    } else {

    }
  } else {
    // If not logged in, determine device type and navigate accordingly
    const isMobile = window.innerWidth <= 768; // Adjust this breakpoint for mobile devices

    if (isMobile) {
      // On mobile view, route to the login page
      this.router.navigate(['/login']).then(success => {
        if (success) {

        } else {

        }
      });
    } else {
      // On laptop/tablet view, route to the toggle login/signup page
      this.router.navigate(['/login-toggle']).then(success => {
        if (success) {

        } else {

        }
      });
    }
  }
}


// Method to increase the quantity of a product, ensuring it does not exceed stock quantity
increaseQuantity(item: CartItem) {
  // Check if the quantity to be increased is within the stock quantity limit
  if (item.quantity < item.product.stockQuantity) {
    item.quantity++;

    // Check if userId, productId, and quantity are valid before making the API call
    if (this.userId !== null && item.product.id !== undefined && item.quantity !== undefined) {
      this.cartService.addOrUpdateCartItem(this.userId, item.product.id, item.quantity).subscribe(
        () => {
          this.calculateTotalAmount();

        },
        error => {

        }
      );
    } else {

    }
  } else {
    // Show a message when the user tries to exceed stock quantity

    alert(`Only ${item.product.stockQuantity} units are available for this product.`);
  }
}


 // Method to decrease the quantity of a product
  decreaseQuantity(item: CartItem) {
    if (item.quantity && item.quantity > 1) { // Only decrease if quantity is greater than 1
      item.quantity--;
      if (this.userId !== null && item.product.id !== undefined) {
        this.cartService.addOrUpdateCartItem(this.userId, item.product.id, item.quantity).subscribe(
          () => {
            this.calculateTotalAmount();

          },
          error => {

          }
        );
      } else {
        
      }
    }
  }
}

