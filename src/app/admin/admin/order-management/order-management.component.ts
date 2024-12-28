import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  searchTerm: string = ''; // Search term for filtering orders

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe(data => {
      this.orders = data;


    });
  }

// Event handler for status change
onStatusChange(event: Event, orderId: number): void {
  const target = event.target as HTMLSelectElement;
  const newStatus = target.value;

  const order = this.orders.find(o => o.orderId === orderId);
  if (order && order.orderStatus === 'Canceled') {
    // Ignore status updates for canceled orders

    return;
  }

  if (newStatus) {
    this.updateOrderStatus(orderId, newStatus);
   
  }
}


  // Method to update the order status
  updateOrderStatus(id: number, status: string): void {
    if (status) {
      this.orderService.updateOrderStatus(id, status).subscribe(updatedOrder => {
        // Update the local orders array if needed
        const orderIndex = this.orders.findIndex(order => order.orderId === id);
        if (orderIndex !== -1) {
          this.orders[orderIndex].orderStatus = status;
        }
      });
    }
  }

  // Method to filter orders by Order ID or Phone Number
  filteredOrders(): Order[] {
    if (!this.searchTerm) {
      return this.orders;
    }

    const lowerCaseTerm = this.searchTerm.toLowerCase();

    return this.orders.filter(order =>
      order.orderId.toString().includes(lowerCaseTerm) ||
      order.address.phone.toLowerCase().includes(lowerCaseTerm)
    );
  }
}
