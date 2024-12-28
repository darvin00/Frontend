import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../services/product.model';
import { DashboardService } from '../../services/dashboard.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  metrics: any = {};
    lowStockProducts: Product[] = [];

  constructor(private dashboardService: DashboardService ,private ProductService:ProductService) { }

  ngOnInit(): void {
     this.fetchLowStockProducts();
    this.dashboardService.getMetrics().subscribe(data => {
      this.metrics = data;
    });
  }

   fetchLowStockProducts(): void {
    this.ProductService.getLowStockProducts().subscribe(
      (products) => {
        this.lowStockProducts = products;
      },
      (error) => {
       
      }
    );
  }
}

