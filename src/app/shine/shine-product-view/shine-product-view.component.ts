import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ShineProductService } from '../services/shine-product.service';
import {
  ProductService,
  Product,
} from '../../sheshine/services/product.service';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../../services/user-profile.model';
import { AuthService } from '../../services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FavoritesService } from '../../services/favorites.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-shine-product-view',
  templateUrl: './shine-product-view.component.html',
  styleUrls: ['./shine-product-view.component.scss'],
})
export class ShineProductViewComponent implements OnInit, OnDestroy {
  // @Input() product: any;
  user: User | null = null;
  loading = true;
  userId: number | null = null;
  product: any;
  isFavorite: boolean = false;
  productDetails: any;
  quantity: number = 1;
  reviewText: string = '';
  reviews: string[] = [];
  private isBrowser: boolean;
  subcategoryProducts: any[] = [];
  isProductAdding: { [key: number]: boolean } = {}; // Tracks "Adding..." state for each product
  isProductAdded: { [key: number]: boolean } = {};
  private favoritesUpdateInterval: any;
  fallbackImage: string = 'assets/images/shine/shineorganic.png';


  touchStartX = 0;
  touchEndX = 0;
  autoScrollInterval: any;



  colors: string[] = [
    '#000',
    '#EDEDED',
    '#D5D6D8',
    '#EFE0DE',
    '#AB8ED1',
    '#F04D44',
  ];
  activeSections: boolean[] = [false, false, false, false];
  cards: Array<{ image: string; title: string; text: string }> = [];
  duplicatedCards: Array<{ image: string; title: string; text: string }> = [];
  cardWidth = 0;
  currentIndex = 0;
  interval!: ReturnType<typeof setInterval>;
  //3d image
  threeDImages: string[] = [];
  images: string[] = [];
  isDragging = false;
  imageIndex = 0;
  startX: number = 0;
  isMobile = false;
   isAddingToCart: boolean = false; // Loading state for adding to cart


  isPopupVisible: boolean = false;
  isRotating: boolean = false;
  selectedProduct: any;




  constructor(
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private shineProductService: ShineProductService,
    private productService: ProductService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private http: HttpClient,
    private favoritesService: FavoritesService,
    private location: Location
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.isMobile = window.innerWidth <= 768;
  }
  isMobileView() {
    return this.isMobile;
  }

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

   console.log(productId)

    // Determine if on a mobile device
    this.isMobile = window.innerWidth <= 768;
    this.cardWidth = this.calculateCardWidth();

    if (this.isBrowser) {
      this.startCarousel();
    }

    // Get the product ID from the route
    

    // Fetch the product details using the product ID
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;


        // Ensure the quantity is a valid number
        if (
          this.product &&
          (typeof this.product.quantity !== 'number' ||
            isNaN(this.product.quantity))
        ) {
          this.product.quantity = 1;
        }

        // Fetch subcategory products if the product has a subcategory
        if (this.product.subcategory) {
          this.fetchSubcategoryProducts(this.product.subcategory);
        }

        // Check if the product is in favorites after fetching details
        if (this.userId) {
          this.checkIfFavorite(this.product.id);
        }
      },
      error: (err) => {

      },
    });



    // Retrieve the userId from localStorage
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

    // Set up subscriptions for route changes
    this.route.params.subscribe((params) => {
      const id =  Number(localStorage.getItem('productId'));
      if (id) {
        this.productService.getProductById(id).subscribe((product) => {
          if (product) {
            this.product = product;

            this.threeDImages = product.threeDImages || [];
            this.images = product.images || [];
          }
        });
      }
    });
    this.route.params.subscribe(params => {
      const id =  Number(localStorage.getItem('productId'));// Get the ID from the route
      this.productService.getShineProducts().subscribe((products: Product[]) => {
        const product = products.find(p => p.id === id);
        if (product && product.cards) {
          this.cards = product.cards;
          this.duplicateCards();
        }
      });
    });


    // Fetch product cards for a shine product
    this.route.params.subscribe((params) => {
      const id =  Number(localStorage.getItem('productId'));
      if (id) {
        this.shineProductService.getProductById(id).subscribe((product) => {
          this.product = product;
          if (this.product) {
            if (
              typeof this.product.quantity !== 'number' ||
              isNaN(this.product.quantity)
            ) {
              this.product.quantity = 1;
            }

            if (this.product.subcategory) {
              this.fetchSubcategoryProducts(this.product.subcategory);
            }
          }
        });
      }
    });


    if (this.userId) {
      // Start the interval to fetch the user's favorites every second
      this.favoritesUpdateInterval = setInterval(() => {
        this.loadFavorites();
      }, 1000); // 1000 ms = 1 second
    } else {

    }
  }

 // Open the popup
 openPopup(): void {
  this.isPopupVisible = true;
}

// Close the popup
closePopup(): void {
  this.isPopupVisible = false;
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
        this.product = data;
        this.loading = false; // Hide loading spinner once data is fetched
      });
  }

  fetchSubcategoryProducts(subcategory: string) {
    this.shineProductService
      .getProductsBySubcategory(subcategory)
      .subscribe((products) => {
        this.subcategoryProducts = products.filter(
          (p) => p.id !== this.product?.id
        ); // Exclude the current product
      });
  }

  calculateCardWidth(): number {
    if (typeof window === 'undefined') {
      // Return a default value or handle the case where window is not available

      return 0; // Default value
    }

    const screenWidth = window.innerWidth;

    if (screenWidth > 1024) {
      return screenWidth / 3; // 3 cards in view for laptop
    } else if (screenWidth >= 768) {
      return screenWidth / 2; // 2 cards in view for tablet
    } else {
      return screenWidth; // 1 card in view for mobile
    }
  }

duplicateCards() {
  // Duplicate the cards array for seamless scrolling
  this.duplicatedCards = [...this.cards, ...this.cards];

  // Check if duplication was successful
  if (this.duplicatedCards.length === this.cards.length * 2) {

  } else {

  }
}

  startCarousel() {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    }, 3000);
  }


  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  changeImage(image: string) {
    if (this.product) {
      this.product.thumbnail = image;
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

  setRating(product: any, rating: number): void {
    if (product) {
      product.averageRating = rating;
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

  submitReview() {
    if (this.reviewText.trim()) {
      this.reviews.unshift(this.reviewText);

      this.reviewText = '';
    } else {
      alert('Review cannot be empty.');
    }
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
          this.isProductAdding[product.id] = false; // Hide "Adding..."
          this.isProductAdded[product.id] = true;
          setTimeout(() => {
            this.isProductAdded[product.id] = false;
          }, 3000); // Reset after 3 seconds

           this.isAddingToCart = false; // End loading state
        this.router.navigate(['/cart']); // Redirect to cart page after successful addition
        },
        error: (error) => {

           this.isAddingToCart = false; // End loading state on error
        },
      });
  }

  toggleContent(index: number): void {
    this.activeSections[index] = !this.activeSections[index];
  }

  isActive(index: number): boolean {
    return this.activeSections[index];
  }

  getClass(index: number): string {
    return this.isActive(index) ? 'collapsible active' : 'collapsible';
  }

  viewProduct(subcategoryProduct: any): void {

    this.router.navigate(['/shine/view', subcategoryProduct.id]);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  //3D image

  startRotation(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startX = this.isTouchEvent(event)
      ? event.touches[0].clientX
      : (event as MouseEvent).clientX;
  }

  rotateImage(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    const currentX = this.isTouchEvent(event)
      ? event.touches[0].clientX
      : (event as MouseEvent).clientX;
    const deltaX = this.startX - currentX;

    if (Math.abs(deltaX) > 10) {
      // Adjust sensitivity
      if (deltaX > 0) {
        this.nextImage();
      } else {
        this.prevImage();
      }
      this.startX = currentX;
    }
  }

  stopRotation() {
    this.isDragging = false;
  }

  prevImage() {
    this.imageIndex =
      this.imageIndex > 0 ? this.imageIndex - 1 : this.threeDImages.length - 1;
  }

  nextImage() {
    this.imageIndex =
      this.imageIndex < this.threeDImages.length - 1 ? this.imageIndex + 1 : 0;
  }

  private isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return 'touches' in event;
  }
}
