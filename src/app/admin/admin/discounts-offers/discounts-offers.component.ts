import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../../services/discount.service'; // Adjust the path as needed
import { Discount } from '../../services/discount'; // Adjust the path as needed

@Component({
  selector: 'app-discounts-offers',
  templateUrl: './discounts-offers.component.html',
  styleUrls: ['./discounts-offers.component.css']
})
export class DiscountsOffersComponent implements OnInit {
  discount = { code: '', amount: 0, description: '', endDate: '' };
  activeDiscounts: any[] = [];

  constructor(private discountService: DiscountService) {}

  ngOnInit(): void {
    this.loadDiscounts();
  }

  onSubmit(): void {
    this.discountService.saveDiscount(this.discount).subscribe(() => {
      this.loadDiscounts();
      this.discount = { code: '', amount: 0, description: '', endDate: '' }; // Clear form
    });
  }

  loadDiscounts(): void {
    this.discountService.getActiveDiscounts().subscribe(data => {
      this.activeDiscounts = data;
    });
  }
}
