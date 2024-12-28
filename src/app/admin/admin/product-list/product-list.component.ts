import { Component, Input } from '@angular/core';
import { Product } from '../../services/product.model'; // Adjust the import path as needed

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Input() products: Product[] | undefined; // Declare 'products' as an input property
}
