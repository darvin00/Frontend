import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://192.168.0.219:8080/api/orders'; // Update with your API base URL

  constructor(private http: HttpClient) {}

  // Fetch all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
  // Update order status by order ID
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    // Wrap the status in quotes
    const quotedStatus = `"${status}"`;

    // Pass the quoted status as the request body
    return this.http.put<Order>(
      `${this.apiUrl}/${orderId}/status`,
      quotedStatus,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }
}

// Define the Order interface according to your backend's Order structure
export interface Order {
  orderId: number;
  orderStatus: string;
  address: {
    id: number;
    name: string;
    type: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
  };
  orderItems: {
    orderItemId: number;
    product: {
      id: number;
      favorited: boolean | null;
      shine: boolean;
      sheShine: boolean;
      subcategory: string;
      category: string;
      mainimage: string;
      cards: {
        id: number;
        text: string | null;
        image: string;
        title: string | null;
      }[];
      images: string[];
      threeDImages: string[];
      thumbnail: string;
      title: string;
      name: string;
      benefit: string;
      suitable: string;
      description: string;
      keybenefit: string;
      howToUse: string;
      ingredients: string;
      size: string;
      mrp: number;
      price: number;
      stockQuantity: number;
      discount: number;
      averageRating: number;
      feature: boolean;
      trend: boolean;
      special: boolean;
      specialLine: string;
      color: string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  amount: number;
  orderDate: string;
  deliveryDate: string;
  product: null; // If this is supposed to hold a product object in some cases, change `null` to `Product | null`
  paymentStatus: string;
  razorpayOrderId: string;
}
