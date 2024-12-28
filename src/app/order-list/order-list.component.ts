import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../services/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getOrders();

  }
  storeOrderId(orderId: number): void {
    localStorage.setItem('selectedOrderId', orderId.toString()); // Convert number to string
  }

  getOrders(): void {
    // Fetch user ID from localStorage
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.orderService.getOrdersByUser(parseInt(userId)).subscribe(
        (data: Order[]) => {
          this.orders = data;

        },
        (error) => {

        }
      );
    } else {
      
    }
  }
}
