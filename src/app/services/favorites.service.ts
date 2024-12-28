import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../sheshine/services/product.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private apiUrl = 'http://192.168.0.219:8080/api/favorites'; // API base URL

  constructor(private http: HttpClient) {}

  // Method to get user favorites
  getUserFavorites(userId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${userId}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  addFavorite(userId: number, productId: number): Observable<string> {
    const url = `${this.apiUrl}/${userId}/${productId}`;
    return this.http.post<string>(url, {});
  }

  removeFavorite(userId: number, productId: number): Observable<string> {
    const url = `${this.apiUrl}/${userId}/${productId}`;
    return this.http.delete<string>(url);
  }
}
