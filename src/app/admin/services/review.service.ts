// review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the ReviewResponse model directly in the service
export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string;
  productId: number;
  userId: number;
  userName: string;
  avatarUrl: string; // Updated to map correctly to the API response
  approved: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = 'http://192.168.0.219:8080/api/reviews'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.baseUrl}/admin/all`);
  }

  approveReview(id: number): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${this.baseUrl}/${id}/approve`, null);
  }
}
