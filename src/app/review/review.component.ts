import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../services/review.service';
import { Review } from '../services/review.model';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  maxStars: number = 5;
  averageRating: number | null = null;
  newReview: Review = { rating: 0, comment: '', userName: '', userAvatar: '', userid: 0, productId: 1 };
  isEligibleToReview: boolean = false;
  eligibilityMessage: string = '';
  successMessage: string = '';  // Success message for review submission
  orders: any[] = [];
  userId: number | null = null;
   isSubmittingReview: boolean = false; // Loading state for review submission
  isSubmittingEdit: boolean = false;
  isDeleting: boolean = false;

  editingReviewId: number | undefined = undefined;
  editedReview: Review = { rating: 0, comment: '', userName: '', userAvatar: '', userid: 0, productId: 1 };

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {

    const state = history.state;  // Access the navigation state
    const productId = state.productId;  // Retrieve the productId from the state

    
    // Fetch user ID from local storage
    const userId = localStorage.getItem('userId');
    this.userId = userId ? +userId : null;

    // Get the dynamic product ID from the URL
    this.route.paramMap.subscribe(params => {
      const productId =state.productId;
      if (productId) {
        this.fetchReviews(productId);
        this.fetchAverageRating(productId);
        this.newReview.productId = productId;

        if (this.userId) {
          this.newReview.userid = this.userId;
          this.fetchUserOrders(this.userId, productId);
        } else {
          this.eligibilityMessage = 'You must be logged in to add a review.';
        }
      }
    });
  }

  fetchReviews(productId: number): void {
    this.reviewService.getReviewsByProductId(productId).subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  getStarArray(stars: number): number[] {
    return Array(stars).fill(0);
  }

  setRating(rating: number): void {
    this.newReview.rating = rating;
  }

  fetchAverageRating(productId: number): void {
    this.reviewService.getAverageRating(productId).subscribe(rating => {
      this.averageRating = rating;
    });
  }

  fetchUserOrders(userId: number, productId: number): void {
    this.orderService.getOrdersByUser(userId).subscribe(orders => {
      this.orders = orders;
      this.checkIfProductPurchased(productId);
    }, error => {

    });
  }

  checkIfProductPurchased(productId: number): void {
    const purchased = this.orders.some(order =>
      order.orderStatus === 'Delivered' && // Check if the order status is 'Delivered'
      order.orderItems?.some((item: { product: { id: number } }) => item.product?.id === productId)
    );

    if (purchased) {
      this.isEligibleToReview = true;
      this.eligibilityMessage = '';
    } else {
      const isCanceled = this.orders.some(order =>
        order.orderStatus === 'Canceled' && // Check if the order status is 'Canceled'
        order.orderItems?.some((item: { product: { id: number } }) => item.product?.id === productId)
      );

      if (isCanceled) {
        this.isEligibleToReview = false;
        this.eligibilityMessage = 'You cannot add a review for this product as the order was canceled.';
      } else {
        this.isEligibleToReview = false;
        this.eligibilityMessage = 'You are not eligible to add a review for this product. Buy and receive the product to share your review.';
      }
    }
  }


  submitReview(): void {
    if (!this.isEligibleToReview) {
      this.eligibilityMessage = 'You are not eligible to add a review for this product. Buy this product to share your review.';
      return;
    }

    // Check if the user already added a review for this product
    const existingReview = this.reviews.find(
      review => review.userid === this.userId && review.productId === this.newReview.productId
    );

    if (existingReview) {
      this.successMessage = 'You have already submitted a review for this product.';
      setTimeout(() => {
        this.successMessage = ''; // Clear message after timeout
      }, 5000);
      return;
    }

    this.isSubmittingReview = true; // Start loading state
    this.reviewService.addReview(this.newReview).subscribe(
      (review) => {
        this.reviews.push(review);
        this.resetNewReview();
        this.fetchAverageRating(this.newReview.productId); // Update average rating

        // Set success message and auto-clear after 5 seconds
        this.successMessage = 'Your review has been sent to admin. Once approved, it will be displayed.';
        this.isSubmittingReview = false; // End loading state
        setTimeout(() => {
          this.successMessage = ''; // Clear message after timeout
        }, 5000);
      },
      (error) => {

        this.isSubmittingReview = false; // End loading state on error
      }
    );
  }


  startEditing(review: Review): void {
    this.editingReviewId = review.id;
    this.editedReview = { ...review };
  }
  private refreshReviewsAndRatings(productId: number): void {
    this.fetchReviews(productId);
    this.fetchAverageRating(productId);
  }

  submitEditedReview(): void {
    if (this.editingReviewId !== undefined && this.editedReview && this.userId !== null) {
      this.isSubmittingEdit = true;
      this.reviewService.editReview(this.editingReviewId, this.editedReview, this.userId).subscribe(
        updatedReview => {
          this.isSubmittingEdit = false;
          this.cancelEditing();
          this.refreshReviewsAndRatings(this.newReview.productId); // Refresh data
        },
        error => {
          this.isSubmittingEdit = false;

        }
      );
    } else {

    }
  }

  cancelEditing(): void {
    this.editingReviewId = undefined;
    this.editedReview = { rating: 0, comment: '', userName: '', userAvatar: '', userid: 0, productId: 1 };
  }

  deleteReview(reviewId?: number): void {
    if (this.userId && reviewId) {
      this.isDeleting = true;
      this.reviewService.deleteReview(reviewId, this.userId).subscribe(() => {
        this.reviews = this.reviews.filter(review => review.id !== reviewId);
        this.isDeleting = false;
      }, error => {

        this.isDeleting = false;
      });
    } else {

    }
  }

  private resetNewReview(): void {
    this.newReview = { rating: 0, comment: '', userName: '', userAvatar: '', userid: this.userId ?? 0, productId: this.newReview.productId };
  }
}
