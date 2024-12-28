import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss',
})
export class FeatureComponent {
  products: any[] = [];
  featureProducts: any[] = [];
  fallbackImage: string = 'assets/images/sheshineproduct/e275-3.jpg';

  constructor(
    private http: HttpClient,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchProducts().subscribe({
      next: (products) => {
        this.products = products;
        // Filter to include only featured products with stockQuantity > 0
        this.featureProducts = this.products.filter(
          (product) => product.feature === true && product.stockQuantity > 0
        );
      },
    });
  }
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImage;
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
 

}
