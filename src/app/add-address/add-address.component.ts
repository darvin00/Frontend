import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, AddressService } from '../services/address.service';
import { UserService } from '../services/user-profile.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  newAddress: Address = {
    name: '',
    type: 'Home',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: ''
  };
    // Method to check if the form is valid
  isFormValid(): boolean {
    return (
      this.newAddress.name.trim() !== '' &&
      this.newAddress.type.trim() !== '' &&
      /^[0-9]{10}$/.test(this.newAddress.phone) && // Validate 10-digit phone
      this.newAddress.addressLine1.trim() !== '' &&
      this.newAddress.city.trim() !== '' &&
      this.newAddress.state.trim() !== '' &&
      this.newAddress.zip.trim() !== ''
    );
  }

  userId: number | null = null;
  addressId: number | null = null; // Store the address ID if editing

  productIds: string = ''; // To store the product IDs from the query params
  productQuantities: string = ''; // To store the product quantities from the query params

  constructor(
    private addressService: AddressService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute , // Inject ActivatedRoute to read route parameters
      private location: Location  // Inject Location service
  ) {}

  ngOnInit(): void {

    this.loadProductsFromNavigationState();
    // Fetch the user ID dynamically
    this.userService.getUserId().subscribe(id => {
      this.userId = id;
    });

    // Check if there's an address ID in the route (for editing)
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.addressId = +params['id'];
        this.loadAddressForEdit(this.addressId);
      }
    });


  }

  // Load the address details for editing
  loadAddressForEdit(addressId: number): void {
    this.addressService.getAddressById(addressId).subscribe(address => {
      this.newAddress = address; // Pre-fill the form with the existing address data
    });
  }

  private loadProductsFromNavigationState(): void {
  const state = history.state;



  if (state && state.ids && state.quantities) {
    this.productIds = state.ids;
    this.productQuantities = state.quantities;


    // Load products based on received IDs and quantities
    // Example: Use product service to fetch the products based on these IDs
    if (this.productIds.length > 0 && this.productQuantities.length > 0) {
      // Call service to load products here
    }
  } else {

  }
}



  // Method to add or update address
  addAddress() {
    if (this.userId) {
      if (this.addressId) {
        // Update the existing address
        this.addressService.updateAddress(this.newAddress).subscribe(
          () => {
            alert('Address updated successfully');
              this.location.back();  // Navigate back to the previous page upon success
          },
          (error) => {
            console.error('Error updating address:', error);
          }
        );
      } else {
        // Add a new address
        this.addressService.addAddressByUserId(this.userId, this.newAddress).subscribe(
          () => {
            alert('Address added successfully');

            this.navigateToAddressList();
          },
          (error) => {
            console.error('Error adding address:', error);
          }
        );
      }
    } else {

    }
  }

// Method to navigate to the address list with product data in navigation state
navigateToAddressList() {
  if (this.productIds.length > 0 && this.productQuantities.length > 0) {
    this.router.navigate(['/address-list'], {
      state: {
        ids: this.productIds, // Pass product IDs as an array
        quantities: this.productQuantities // Pass product quantities as an array
      }
    }).then(success => {
      if (success) {

      } else {

      }
    });
  } else {

  }
}

}
