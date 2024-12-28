import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../../services/offer.service';

@Component({
  selector: 'app-offer-management',
  templateUrl: './offer-management.component.html',
  styleUrls: ['./offer-management.component.scss']
})
export class OfferManagementComponent implements OnInit {
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

createOffer(): void {
  const { productId, offerDescription, timeRemaining } = this.newOffer;

  // Ensure productId and timeRemaining are not null before calling the service
  if (productId !== null && timeRemaining !== null) {
    // Temporarily update the offers list optimistically
    this.offers.push({ id: Date.now(), productId, offerDescription, timeRemaining });

    this.offerService.createOffer(productId, offerDescription, timeRemaining).subscribe(() => {
      // Refresh the list after the server operation completes
      this.loadOffers();
      this.newOffer = { productId: null, offerDescription: '', timeRemaining: null };
    }, error => {
      // If there's an error, remove the optimistically added offer
      this.offers.pop();

    });
  }
}


 updateOffer(): void {
  const { id, offerDescription, timeRemaining } = this.editOfferData;

  // Ensure id and timeRemaining are not null before calling the service
  if (id !== null && timeRemaining !== null) {
    // Temporarily update the offers list optimistically
    const updatedOffer = { id, offerDescription, timeRemaining };
    const index = this.offers.findIndex(offer => offer.id === id);
    if (index !== -1) {
      this.offers[index] = updatedOffer; // Optimistically update the UI
    }

    this.offerService.editOffer(id, offerDescription, timeRemaining).subscribe(() => {
      // Refresh the list after the server operation completes
      this.loadOffers();
      this.editOfferData = { id: null, offerDescription: '', timeRemaining: null };
    }, error => {
      // If there's an error, revert the UI changes
      this.loadOffers();

    });
  }
}


deleteOffer(id: number): void {
  // Temporarily remove the offer from the list optimistically
  this.offers = this.offers.filter(offer => offer.id !== id);

  this.offerService.deleteOffer(id).subscribe(() => {
    // Refresh the list after the server operation completes
    this.loadOffers();
  }, error => {
    // If there's an error, restore the offer in the UI
    this.loadOffers();
   
  });
}


  selectOfferToEdit(offer: any): void {
    this.editOfferData = { id: offer.id, offerDescription: offer.offerDescription, timeRemaining: offer.timeRemaining };
  }


}
