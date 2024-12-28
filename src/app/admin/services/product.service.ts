import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://192.168.0.219:8080/api/products'; // Adjust base URL if necessary

  constructor(private http: HttpClient) {}

  addProduct(productData: FormData) {
    return this.http
      .post<Product>(`${this.apiUrl}/add`, productData)
      .toPromise();
  }

  updateProduct(id: number, productData: FormData) {
    return this.http
      .put<Product>(`${this.apiUrl}/update/${id}`, productData)
      .toPromise();
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).toPromise();
  }

  // Get all products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/getall`);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { responseType: 'text' });
  }
  
  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
  }
}
