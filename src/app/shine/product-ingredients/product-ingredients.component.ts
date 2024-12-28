import { Component, Inject, PLATFORM_ID, OnInit,OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProductService, Product} from '../../sheshine/services/product.service';
@Component({
  selector: 'app-product-ingredients',
  templateUrl: './product-ingredients.component.html',
  styleUrls: ['./product-ingredients.component.scss']
})
export class ProductIngredientsComponent implements OnInit, OnDestroy {
  private isBrowser: boolean;
     cards: Array<{ image: string; title: string; text: string }> = [];


  currentIndex = 0;
  interval!: ReturnType<typeof setInterval>; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient,private productService: ProductService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startCarousel();
    }
        this.productService.getShineProducts().subscribe((products: Product[]) => {
      const firstProduct = products[0]; // Adjust according to your requirement
      if (firstProduct && firstProduct.cards) {
        this.cards = firstProduct.cards;
      }
    });

    
  }
   

  startCarousel() {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.cards.length;
      const carouselWrapper = document.querySelector('.carousel-wrapper') as HTMLElement;
      if (carouselWrapper) {
        const percentage = -(this.currentIndex * 100);
        carouselWrapper.style.transform = `translateX(${percentage}%)`;
      }
    }, 3000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
