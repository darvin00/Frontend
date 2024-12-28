import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Address } from './address.model'; // Adjust the import path according to your project structure

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private apiUrl = 'http://192.168.0.219:8080/api/addresses'; // Update with your Spring Boot API URL

  // BehaviorSubject to manage the selected address
  private selectedAddressSubject = new BehaviorSubject<Address | null>(null);

  constructor(private http: HttpClient) {}

  // Method to add address by user ID
  addAddressByUserId(userId: number, address: Address): Observable<Address> {
    const url = `${this.apiUrl}/add/user/${userId}`;
    return this.http.post<Address>(url, address);
  }

  // Method to get addresses by user ID
  getAddressesByUserId(userId: number): Observable<Address[]> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<Address[]>(url);
  }

  // Method to get address by ID
  getAddressById(id: number): Observable<Address> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Address>(url);
  }

  updateAddress(address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/update`, address);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Method to select an address and notify subscribers
  selectAddress(address: Address): void {
    this.selectedAddressSubject.next(address);
  }

  // Method to get the selected address as an Observable
  getSelectedAddressObservable(): Observable<Address | null> {
    return this.selectedAddressSubject.asObservable();
  }

  // Method to get the selected address by user ID
  getSelectedAddress(userId: number): Observable<Address> {
    const url = `${this.apiUrl}/select/${userId}`;
    return this.http.get<Address>(url).pipe(
      catchError((error) => {

        return throwError(error);
      })
    );
  }
}
export { Address };
