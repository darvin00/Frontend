// discount.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Discount {
  code: string;
  amount: number;
  description?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private apiUrl = 'http://192.168.0.219:8080/api/discounts'; // Your backend URL

  constructor(private http: HttpClient) {}

  saveDiscount(discount: Discount): Observable<Discount> {
    return this.http.post<Discount>(this.apiUrl, discount);
  }

  getActiveDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.apiUrl);
  }
}
