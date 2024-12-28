import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://192.168.0.219:8080/api/orders/place'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  // Create order

  // Verify payment
  verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('paymentId', paymentId)
      .set('orderId', orderId)
      .set('signature', signature);

    return this.http.post<any>(`${this.apiUrl}/verifyPayment`, null, {
      params,
    });
  }
}
