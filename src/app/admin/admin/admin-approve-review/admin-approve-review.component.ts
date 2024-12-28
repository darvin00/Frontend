import { Component, OnInit } from '@angular/core'; 
import { ReviewService, ReviewResponse } from '../../services/review.service';

@Component({
  selector: 'app-admin-approve-review',
  templateUrl: './admin-approve-review.component.html',
  styleUrls: ['./admin-approve-review.component.scss']
})
export class AdminApproveReviewComponent implements OnInit {
  reviews: ReviewResponse[] = [];
  unapprovedReviews: ReviewResponse[] = []; // Array to hold unapproved reviews

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.getReviews();
  }

  getReviews(): void {
    this.reviewService.getAllReviews().subscribe(
      (data: ReviewResponse[]) => {
        this.reviews = data;
        this.filterUnapprovedReviews(); // Filter reviews after fetching
      },
      error => {
        console.error('Error fetching reviews', error);
      }
    );
  }

  filterUnapprovedReviews(): void {
    this.unapprovedReviews = this.reviews.filter(review => !review.approved); // Filter unapproved reviews
  }

  approveReview(id: number): void {
    this.reviewService.approveReview(id).subscribe(
      (approvedReview: ReviewResponse) => {
        // Update the review in the local list
        const index = this.unapprovedReviews.findIndex(review => review.id === approvedReview.id);
        if (index !== -1) {
          this.unapprovedReviews[index] = approvedReview; // Update the review status
        }
      },
      error => {
        console.error('Error approving review', error);
      }
    );
  }
}
