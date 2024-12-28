import { Component, OnInit, Inject, ElementRef, Renderer2, Input } from '@angular/core';
import { NavigationExtras, NavigationStart, Router } from '@angular/router';
import { ProductService, Product } from '../sheshine/services/product.service';
import { AddressService } from '../services/address.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Address } from '../services/address.model';
import { UserService } from '../services/user-profile.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
  addresses: Address[] = [];
  @Input() product: Product[] = [];
  selectedAddress: Address | null = null;
  private isBrowser: boolean;
  productIds: number[] = [];
  productQuantities: number[] = [];
  userId: number | null = null;

  constructor(
    private addressService: AddressService,
    private router: Router,
    private productService: ProductService,
    private el: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Load User ID and addresses
    this.userService.getUserId().subscribe(userId => {
      if (userId !== null && userId !== undefined) {

        this.userId = userId;
        this.loadAddresses();
        this.loadSelectedAddress();
      } else {

      }
    });

     this.route.paramMap.subscribe(() => {
    this.loadProductsFromNavigationState();
     });

     this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      // Save the current URL before navigating to the new route
      sessionStorage.setItem('previousPage', this.router.url);
    }
  });
  }

  private loadAddresses(): void {
    if (this.userId !== null) {

      this.addressService.getAddressesByUserId(this.userId).subscribe(
        (addresses: Address[]) => {
          this.addresses = addresses;

        },
        error => {
          console.error('Error loading addresses:', error);
        }
      );
    } else {
      console.error('User ID is not available for loading addresses.');
    }
  }
 goBack() {
    const previousPage = sessionStorage.getItem('previousPage');
    if (previousPage) {
     this.router.navigate(['/cart']);
    } else {
       this.router.navigate(['/cart']); // Fallback if no previous page is found
    }
  }
private loadProductsFromNavigationState(): void {
  // Use history.state to capture the state after navigation
  const state = history.state;



  if (state && state.ids && state.quantities) {
    const { ids, quantities } = state;

    // Ensure ids and quantities are valid arrays
    if (Array.isArray(ids) && Array.isArray(quantities)) {
      this.productIds = ids;
      this.productQuantities = quantities;



      // Fetch products based on received IDs
      this.productService.getProductsFromBothSources().subscribe(products => {
        this.product = products.filter(p => this.productIds.includes(p.id));
        this.product.forEach((product: Product, index: number) => {
          product.quantity = this.productQuantities[index];
        });
      });
    } else {
      console.error('Invalid format for IDs or quantities:', { ids, quantities });
    }
  } else {
    console.error('No product IDs or quantities found in navigation state.');
  }
}

  private loadSelectedAddress(): void {
    if (this.userId !== null) {

      this.addressService.getSelectedAddress(this.userId).subscribe(
        address => {
          this.selectedAddress = address;

        },
        error => {

        }
      );
    } else {

    }
  }

  selectAddress(address: Address): void {
    this.addressService.selectAddress(address);
    this.selectedAddress = address;
  }

  deliver(): void {
    if (this.selectedAddress) {
      if (this.productIds.length > 0) {
        const quantities = this.product.map((p: Product) => p.quantity).join(',');



        // Create NavigationExtras to pass state
        const navigationExtras: NavigationExtras = {
          state: {
            ids: this.productIds,
            quantities: this.productQuantities

          }
        };
        sessionStorage.setItem('previousPage', this.router.url);

        // Navigate to payment page with the state
        this.router.navigate(['/payment'], navigationExtras);
      } else {
        console.error('No products selected.');
      }
    } else {
      console.error('No address selected.');
    }
  }

navigateToAddAddress(): void {
  if (this.productIds.length > 0 && this.productQuantities.length > 0) {
    this.router.navigate(['/add-address'], {
      state: {
        ids: this.productIds,          // Pass product IDs as an array
        quantities: this.productQuantities // Pass quantities as an array
      }
    }).then(success => {
      if (success) {

      } else {

      }
    });
  } else {

  }
}


  updateAddress(address: Address | null = null): void {
    if (this.productIds.length > 0 && this.productQuantities.length > 0) {
      const ids = this.productIds.join(',');
      const quantities = this.productQuantities.join(',');

      if (address && address.id) {
        this.router.navigate(['/add-address', address.id], {
          queryParams: { ids: ids, quantities: quantities }
        });
      } else {

      }
    } else {
      
    }
  }

  deleteAddress(id?: number): void {
    if (id !== undefined) {
      if (confirm('Are you sure you want to delete this address?')) {
        this.addressService.deleteAddress(id).subscribe(() => {
          alert('Address deleted successfully');
          this.loadAddresses();
        });
      }
    } else {
      alert('Invalid address ID');
    }
  }
}
