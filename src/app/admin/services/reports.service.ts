import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private baseUrl = 'http://192.168.0.219:8080/api/reports';

  constructor(private http: HttpClient) {}

  getSalesReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sales-reports`);
  }

  getCustomerBehavior(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customer-behavior`);
  }

  getInventoryReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventory-reports`);
  }
}
