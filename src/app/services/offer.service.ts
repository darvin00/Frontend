import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = 'http://192.168.0.219:8080/api/offers';

  constructor(private http: HttpClient) { }

  createOffer(productId: number, offerDescription: string, durationInHours: number): Observable<string> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('offerDescription', offerDescription)
      .set('durationInHours', durationInHours.toString());

    return this.http.post<string>(`${this.apiUrl}/create`, {}, { params });
  }

  editOffer(offerId: number, newDescription: string, newDuration: number): Observable<string> {
    const params = new HttpParams()
      .set('newDescription', newDescription)
      .set('newDuration', newDuration.toString());

    return this.http.put<string>(`${this.apiUrl}/edit/${offerId}`, {}, { params });
  }

  deleteOffer(offerId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${offerId}`);
  }

  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
