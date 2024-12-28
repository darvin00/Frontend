import { Component, Input } from '@angular/core';
import { Product } from '../services/product.model';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list">
      <h3>{{ title }}</h3>
      <ul>
        <li *ngFor="let product of products">
          {{ product.name }} - {{ product.quantity }} in stock
        </li>
      </ul>
    </div>
  `,

})
export class ProductListComponent {
  @Input() title!: string;
  @Input() products!: Product[];
}
