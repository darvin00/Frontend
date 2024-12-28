import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ElementRef, Renderer2 } from '@angular/core';
import { ProductService } from '../services/product.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit, AfterViewInit, OnDestroy {
  products: any[] = [];
  filteredProducts: any[] = [];
  private container!: HTMLElement;
  private productList!: HTMLElement;
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private isBrowser: boolean;
   private currentIndex = 0; // Track the current card index
  private intervalId: any;
   isFavorite: boolean = false;
   fallbackImage: string = 'assets/images/jellary/1a.jpg';


  constructor(
    private productService: ProductService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute,
     private favoritesService: FavoritesService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = this.getUniqueProductsByCategory(this.products); // Show only one product per category initially
    });
    this.filteredProducts = this.products.filter(product => product.isAvailable);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.container = this.el.nativeElement.querySelector('.card-container');
      this.productList = this.el.nativeElement.querySelector('.product-list');


      // Add touch event listeners
      this.renderer.listen(this.container, 'touchstart', (event) => this.onDragStart(event as TouchEvent));
      this.renderer.listen(this.container, 'touchend', () => this.onDragEnd());
      this.renderer.listen(this.container, 'touchmove', (event) => this.onDragMove(event as TouchEvent));
    }
  }
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackImage;
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed
  }

  getUniqueProductsByCategory(products: any[]): any[] {
    const categoryMap = new Map<string, any>();

    products.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, product);
      }
    });

    return Array.from(categoryMap.values());
  }

  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.startX = this.getEventX(event) - this.container.offsetLeft;
    this.scrollLeft = this.container.scrollLeft;
  }

  onDragEnd(): void {
    this.isDragging = false;
  }

  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = this.getEventX(event) - this.container.offsetLeft;
    const walk = (x - this.startX) * 2; // Adjust scroll speed
    this.container.scrollLeft = this.scrollLeft - walk;
  }

  private getEventX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
  }

  showCategoryProducts(category: string): void {
    const filteredProductIds = this.products
      .filter(product => product.category === category)
      .map(product => product.id);

    this.router.navigate(['/sheshine/products', category], {
      queryParams: { ids: filteredProductIds.join(',') }
    }).then(success => {

    }).catch(err => {

    });
  }

 private moveToCard(index: number): void {
    const width = this.container.offsetWidth;
    this.renderer.setStyle(this.productList, 'transform', `translateX(-${width * index}px)`);
  }

  private startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.filteredProducts.length;
      this.moveToCard(this.currentIndex);
    }, 3000); // Change card every 3 seconds
  }






}
