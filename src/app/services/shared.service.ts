import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private searchQuerySource = new BehaviorSubject<string>('');
  currentSearchQuery = this.searchQuerySource.asObservable();


   private cartCountSubject = new BehaviorSubject<number>(0); // Initial count is 0
  cartCount$ = this.cartCountSubject.asObservable(); // Observable to subscribe to


  constructor() { }

  changeSearchQuery(query: string) {
    this.searchQuerySource.next(query);
  }

 
  // Method to update the cart count
  updateCartCount(count: number) {
    this.cartCountSubject.next(count);
  }

 
}
