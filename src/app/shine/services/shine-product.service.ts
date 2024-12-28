import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  keybenefit: string;
  howToUse: string;
  size: string;
  mrp: number;
  discount: number;
  price: number;
  image: string;
  image1: string;
  category?: string;
  subcategory?: string;
  specialLine: string;
  quantity?: number;
  thumbnail: string;
  stockQuantity: number;
  cards?: Array<{ image: string; title: string; text: string }>;
  images?: string[];
  threeDImages?: string[]; // Array for storing 360° images
}

@Injectable({
  providedIn: 'root',
})
export class ShineProductService {
  private baseUrl: string = 'http://192.168.0.219:8080/api/products/json'; // Path to your JSON file

  constructor(private http: HttpClient) {}

  // Fetch all products but filter by `shine` and exclude `stockQuantity = 0`
  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.baseUrl)
      .pipe(
        map((products: any[]) =>
          products.filter(
            (product) => product.shine === true && product.stockQuantity > 0
          )
        )
      );
  }

  // Fetch products by subcategory and exclude `stockQuantity = 0`
  getProductsBySubcategory(subcategory: string): Observable<Product[]> {
    return new Observable((observer) => {
      this.getAllProducts().subscribe((products) => {
        const filteredProducts = products.filter(
          (product) =>
            product.subcategory === subcategory && product.stockQuantity > 0
        );
        observer.next(filteredProducts);
        observer.complete();
      });
    });
  }

  // Fetch products by category and exclude `stockQuantity = 0`
  getProductsByCategory(category: string): Observable<Product[]> {
    return new Observable((observer) => {
      this.getAllProducts().subscribe((products) => {
        const filteredProducts = products.filter(
          (product) =>
            product.category === category && product.stockQuantity > 0
        );
        observer.next(filteredProducts);
        observer.complete();
      });
    });
  }

  // Fetch a product by its ID and ensure it has `stockQuantity > 0`
  getProductById(id: number): Observable<Product> {
    return new Observable((observer) => {
      this.getAllProducts().subscribe((products) => {
        const product = products.find(
          (p) => p.id === id && p.stockQuantity > 0
        );
        observer.next(product);
        observer.complete();
      });
    });
  }


  





}
