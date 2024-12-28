import { Component, OnInit } from '@angular/core';
import { PendingOrderService } from '../../services/pendingorder.service';

@Component({
  selector: 'app-pending-order',
  templateUrl: './pending-order.component.html',
  styleUrls: ['./pending-order.component.scss']
})
export class PendingOrderComponent implements OnInit {
  pendingOrder: any;

  constructor(private pendingOrderService: PendingOrderService) { }

  ngOnInit(): void {
    const orderId = 1; // Replace with dynamic ID as needed
    this.pendingOrderService.getPendingOrder(orderId)
      .subscribe(data => {
        this.pendingOrder = data;
      });
  }
}
