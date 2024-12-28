// navbar.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private hideNavBar = new Subject<boolean>();

  hideNavBar$ = this.hideNavBar.asObservable();

  hide() {
    this.hideNavBar.next(true);
  }
  private apiUrl = 'http://192.168.0.219:8080/api/cart'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Function to get the cart count (distinct items)
  getCartCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/distinct-items/${userId}`);
  }
}
