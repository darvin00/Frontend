import { Component, OnInit, Input } from '@angular/core';
import { Address, AddressService } from '../services/address.service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { ProductService, Product } from '../sheshine/services/product.service';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../services/payments.service';
import { Order } from '../services/order.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  selectedAddress: Address | null = null;
  @Input() products: Product[] = [];
  totalAmount: number = 0;
  outOfStockMessage: string = ''; // To store the message for out of stock products

  userId: number | null = null;
  userEmail: string | null = null;
  userName: string | null = null;
  userPhone: string | null = null;
  isProcessing = false;


  // New properties to store product IDs and quantities
  productIds: number[] = [];
  productQuantities: number[] = [];

  constructor(
    private addressService: AddressService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService,
    private paymentService: PaymentService,
     private location: Location,
  ) {}

  ngOnInit(): void {
    this.getNavigationData(); // Retrieve the product IDs and quantities from router state

    this.addressService.getSelectedAddressObservable().subscribe(
      address => {
        this.selectedAddress = address;
        if (address) {
          this.userName = address.name;
          this.userPhone = address.phone;
        }
      },
      error => {

      }
    );
     this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      // Save the current URL before navigating to the new route
      sessionStorage.setItem('previousPage', this.router.url);
    }
  });

    this.loadUserDetailsFromLocalStorage();
  }

private getNavigationData(): void {
  const state = history.state;


  if (state && state.ids && state.quantities) {
    this.productIds = state.ids;
    this.productQuantities = state.quantities;


    // Load products based on IDs and quantities
    if (this.productIds.length > 0 && this.productQuantities.length > 0) {
      this.loadProducts(this.productIds, this.productQuantities);
    }
  } else {

  }
  }
   goBack() {
    const previousPage = sessionStorage.getItem('previousPage');
    if (previousPage) {
      window.history.back();
    } else {
       this.router.navigate(['/cart']); // Fallback if no previous page is found
    }
  }


  private loadProducts(productIds: number[], productQuantities: number[]): void {
    const combinedProducts: Product[] = [];

    this.productService.getProducts().subscribe(products => {
      const filteredProducts = products.filter(p => productIds.includes(p.id));
      this.checkStockAndRemove(filteredProducts, productIds, productQuantities, combinedProducts);

      this.productService.getShineProducts().subscribe(shineProducts => {
        const filteredShineProducts = shineProducts.filter(p => productIds.includes(p.id));
        this.checkStockAndRemove(filteredShineProducts, productIds, productQuantities, combinedProducts);
        this.products = combinedProducts;
        this.calculateTotalAmount();
      });
    });
  }

  private checkStockAndRemove(products: Product[], productIds: number[], productQuantities: number[], combinedProducts: Product[]): void {
    products.forEach((product, index) => {
      const stockQuantity = product.stockQuantity || 0;
      if (stockQuantity === 0) {
        this.outOfStockMessage = `Product "${product.name}" is out of stock and has been removed from your order.`;

      } else {
        const quantityIndex = productIds.indexOf(product.id);
        if (quantityIndex !== -1) {
          product.quantity = productQuantities[quantityIndex];
        }
        combinedProducts.push(product);
      }
    });
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.products.reduce((acc, product) => acc + (product.price * (product.quantity || 1)), 0);

  }

  private loadUserDetailsFromLocalStorage(): void {
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user.id;
      this.userEmail = user.email || 'no-email@example.com';
      this.userName = user.name || 'Anonymous';
      this.userPhone = user.mobileNumber || '0000000000';

    } else {

    }
  }

onProceedToPay(): void {
  if (this.selectedAddress && this.products.length > 0) {
    this.isProcessing = true;
    const addressId = this.selectedAddress.id; // Get the selected address ID
    const userName = this.selectedAddress?.name || 'Guest'; // Fallback to 'Guest' if no name
    const userEmail = this.userEmail || 'customer@example.com'; // Use email from localStorage or provide a default
    const userPhone = this.selectedAddress?.phone || '0000000000'; // Fallback to a default number

    // Calculate order and delivery dates
    const orderDate = new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 7);

    // Construct the orderItems array
    const orderItems = this.products.map((product) => {
      return {
        productId: product.id,
        quantity: product.quantity || 1, // Default to 1 if quantity is not provided
      };
    });

    // Construct the final orderData object
    const orderData = {
      userId: this.userId ?? 1, // Default userId if not provided
      addressId: addressId,
      deliveryDate: deliveryDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      orderItems: orderItems,
    };

    // Send a single order request to create an order
    this.orderService.createOrder(orderData).subscribe(
      (orderResponse) => {
         this.isProcessing = false;
        const options: any = {
          key: 'rzp_test_TWRDmj35Xa1agr', // Razorpay test key
          amount: this.totalAmount * 100, // Amount in paise (multiply by 100)
          currency: 'INR',
          name: 'Your Company Name',
          description: `Payment for order ID: ${orderResponse.id}`,
          order_id: orderResponse.id, // Use backend-generated Razorpay order ID
          handler: (response: any) => {
            // Payment success handler
            const paymentDetails = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            };


            this.verifyPayment(paymentDetails);
          },
          prefill: {
            name: userName,
            email: userEmail,
            contact: userPhone,
          },
          notes: {
            address: `${this.selectedAddress?.addressLine1 || ''}, ${this.selectedAddress?.addressLine2 || ''}`,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();


      },
      (error) => {
        this.isProcessing = false;

      }
    );
  } else {
    alert('Please confirm the address or product details on the previous page. Do you want to go back?')

  }
}

  verifyPayment(paymentDetails: any) {
    this.router.navigate(['/orders']);
    this.orderService.verifyPayment(paymentDetails).subscribe(
      (response) => {


      },
      (error) => {
      
      }
    );
  }
}
