import { Component, OnInit } from '@angular/core';
import { CustomerBehaviorService } from '../../services/customerbehavior.service';

@Component({
  selector: 'app-customer-behavior',
  templateUrl: './customer-behavior.component.html',
  styleUrls: ['./customer-behavior.component.scss']
})
export class CustomerBehaviorComponent implements OnInit {
  customerBehavior: any;

  constructor(private customerBehaviorService: CustomerBehaviorService) { }

  ngOnInit(): void {
    const customerId = 1; // Replace with dynamic ID as needed
    this.customerBehaviorService.getCustomerBehavior(customerId)
      .subscribe(data => {
        this.customerBehavior = data;
      });
  }
}
