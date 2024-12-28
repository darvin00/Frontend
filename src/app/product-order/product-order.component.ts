import { Component,OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../sheshine/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.scss']
})
export class ProductOrderComponent  {
  product: any;

  isFavorite = false;

  toggleFavorite(product: any) {
    this.isFavorite = !this.isFavorite;
  }

  constructor(private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService) { }

  buyNow() {

       this.router.navigate(['/address-list'], { queryParams: { productId: this.product.id } });
  
  }
  addToCart(product: any)
    {

  //     this.cartService.addToCart(product);
  //   }

 
  // ngOnInit(): void {
  //   const id = +this.route.snapshot.paramMap.get('id')!;
  //   this.productService.getProducts().subscribe(products => {
  //     this.product = products.find(p => p.id === id);
  //   });



  }
}
