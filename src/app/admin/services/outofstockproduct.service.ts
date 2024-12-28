import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OutOfStockProductService {
  private baseUrl =
    'http://192.168.0.219:8080/api/analytics/out-of-stock-products';

  constructor(private http: HttpClient) {}

  getOutOfStockProduct(productId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${productId}`);
  }
}
