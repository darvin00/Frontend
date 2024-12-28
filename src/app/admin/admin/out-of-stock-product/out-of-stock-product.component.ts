import { Component, OnInit } from '@angular/core';
import { OutOfStockProductService } from '../../services/outofstockproduct.service';

@Component({
  selector: 'app-out-of-stock-product',
  templateUrl: './out-of-stock-product.component.html',
  styleUrls: ['./out-of-stock-product.component.scss']
})
export class OutOfStockProductComponent implements OnInit {
  outOfStockProduct: any;

  constructor(private outOfStockProductService: OutOfStockProductService) { }

  ngOnInit(): void {
    const productId = 1; // Replace with dynamic ID as needed
    this.outOfStockProductService.getOutOfStockProduct(productId)
      .subscribe(data => {
        this.outOfStockProduct = data;
      });
  }
}
