import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
})
export class TrendingComponent implements OnInit {
  products: any[] = [];
  trendingProducts: any[] = [];
  fallbackImage: string = 'assets/images/sheshineproduct/trending.webp';

  constructor(
    private http: HttpClient,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.fetchProducts().subscribe((products) => {
      this.products = products;
      this.trendingProducts = this.products.filter(
        (product) => product.trend === true && product.stockQuantity > 0
      );
    });
  }

  fetchProducts(): Observable<any[]> {
    return this.http.get<any[]>('http://192.168.0.219:8080/api/products/json');
  }
  buyProduct(product: any): void {
    localStorage.setItem('productId', product.id); 
    this.router.navigate(['/sheshine/sheshineview'], {
      state: { productId: product.id }
    });
  }
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImage;
  }
}
