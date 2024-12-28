import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from './review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://192.168.0.219:8080/api/reviews'; // Your API base URL

  constructor(private http: HttpClient) {}

  addReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/add`, review);
  }

  getReviewsByProductId(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/product/${productId}`);
  }

  getAverageRating(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/product/${productId}/average`);
  }
  // Method to edit a review
  editReview(
    id: number,
    updatedReview: Review,
    userId: number
  ): Observable<Review> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // PUT request to update the review
    return this.http.put<Review>(
      `${this.apiUrl}/${id}?userId=${userId}`,
      updatedReview,
      { headers }
    );
  }

  // Method to delete a review
  deleteReview(reviewId: number, userId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`, { params });
  }
  // Method to approve a review by its ID
  approveReview(id: number): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}/approve`, {});
  }
}
