import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Product } from '../sheshine/services/product.service';
// Adjust import path if necessary
// export interface CartItem {
//   id: number;           // Unique identifier for the cart item
//   userId: number;       // ID of the user who owns the cart
//   productId: number;    // ID of the product in the cart
//   quantity: number;     // Quantity of the product in the cart
//   price: number;        // Price of the product
//   // Add any other properties related to CartItem as needed
// }
export interface CartItem {
  userId: number; // ID of the user who owns the cart
  productId: number;
  addedDate: null;
  id: number;
  product: {
    shine: boolean;
    sheShine: boolean;
    productId: number;
    id: number;
    name: string;
    description: string;
    keyBenefits: string;
    benefit: string;
    color: string;
    size: string;
    mrp: number;
    discount: number;
    price: number;
    image: string;
    thumbnail: string;
    image1: string;
    category?: string;
    suitable: string;
    subCategory?: string;
    stockQuantity: number;
    quantity: number;
    cards?: Array<{ image: string; title: string; text: string }>;
    images?: string[];
    threeDImages?: string[];
    // Add other product properties here
  };
  price: number;
  quantity: number;
  totalPrice: number;

  // MRP (Maximum Retail Price) of the product
  // Add any other properties related to CartItem as needed
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  // BehaviorSubject to track the cart count
  private cartItemCountSource = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSource.asObservable();

  private apiUrl = 'http://192.168.0.219:8080/api/cart'; // Base URL for cart API, replace with your actual backend URL

  constructor(private http: HttpClient) {}

  // Get cart items for a specific user
  getCartItems(userId: number): Observable<CartItem[]> {
    return this.http
      .get<CartItem[]>(`${this.apiUrl}/items/${userId}`)
      .pipe(catchError(this.handleError));
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  // Add or update cart items
  addOrUpdateCartItem(
    userId: number,
    productId: number,
    quantity: number
  ): Observable<any> {
    // Ensure that the productId, userId, and quantity are defined
    if (productId == null || userId == null || quantity == null) {

      return throwError(() => new Error('Invalid parameters')); // Handle invalid inputs
    }
    const params = {
      userId: userId.toString(),
      productId: productId.toString(),
      quantity: quantity.toString(),
    };
    return this.http
      .post<any>(`${this.apiUrl}/add`, null, { params })
      .pipe(catchError(this.handleError));
  }

  // Remove an item from the cart by cartItemId
  removeCartItem(cartItemId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/remove/${cartItemId}`)
      .pipe(catchError(this.handleError));
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
