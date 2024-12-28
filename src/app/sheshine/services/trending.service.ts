// src/app/card.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrendingService {
  private jsonUrl = 'assets/data/trends.json';

  constructor(private http: HttpClient) {}

  getCards(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }
}
