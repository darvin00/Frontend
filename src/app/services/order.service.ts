import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Order } from './order.model'; // Assuming you have an Order interface or model

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://192.168.0.219:8080/api/orders'; // Update with your backend API URL

  constructor(private http: HttpClient) {}

  // Place an order
  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/place`, order);
  }

  // Verify payment
  verifyPayment(paymentDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verifyPayment`, paymentDetails);
  }

  // Get all orders by user ID
  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Get order by ID
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`);
  }

  // Get all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  cancelOrderWithRefund(orderId: number): Observable<any> {
    const url = `${this.apiUrl}/${orderId}/cancel`;
    return this.http.put(url, null).pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
