import { Component, OnInit } from '@angular/core';
import { ShippingDetailService } from '../../services/shippingdetail.service';

@Component({
  selector: 'app-shipping-detail',
  templateUrl: './shipping-detail.component.html',
  styleUrls: ['./shipping-detail.component.scss']
})
export class ShippingDetailComponent implements OnInit {
  shippingDetail: any;

  constructor(private shippingDetailService: ShippingDetailService) { }

  ngOnInit(): void {
    const orderId = 1; // Replace with dynamic ID as needed
    this.shippingDetailService.getShippingDetail(orderId)
      .subscribe(data => {
        this.shippingDetail = data;
      });
  }
}
