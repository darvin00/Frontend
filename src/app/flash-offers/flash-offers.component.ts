import { Component, OnInit } from '@angular/core';
import { OfferService } from '../services/offer.service';

@Component({
  selector: 'app-flash-offers',
  templateUrl: './flash-offers.component.html',
  styleUrls: ['./flash-offers.component.scss']
})
export class FlashOffersComponent implements OnInit {
  offers: any[] = [];
  newOffer = { productId: null as number | null,offerDescription: '', timeRemaining: null as number | null };
  editOfferData = { id: null as number | null, offerDescription: '', timeRemaining: null as number | null };

  constructor(private offerService: OfferService) { }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.offerService.getAllOffers().subscribe(data => {
      this.offers = data;
    });
  }
}
