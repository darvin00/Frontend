import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-image-360-view',
  templateUrl: './image-360-view.component.html',
  styleUrls: ['./image-360-view.component.css']
})
export class Image360ViewComponent {
  images: string[] = [
    'assets/images/360 images/Screenshot 2024-08-19 141759.png',
    'assets/images/360 images/Screenshot 2024-08-19 141811.png',
    'assets/images/360 images/Screenshot 2024-08-19 141827.png',
    'assets/images/360 images/Screenshot 2024-08-19 141838.png',
    'assets/images/360 images/Screenshot 2024-08-19 141905.png',
    'assets/images/360 images/Screenshot 2024-08-19 141916.png'
  ];

  currentIndex = 0;
  isDragging = false;
  startX = 0;
  sensitivity = 10; // Adjust rotation sensitivity

  /**
   * Start rotation when mouse or touch interaction begins
   */
  startRotation(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.startX = this.getClientX(event);
  }

  /**
   * Handle image rotation during drag/touch movement
   */
  rotateImage(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;

    const currentX = this.getClientX(event);
    const deltaX = this.startX - currentX;

    if (Math.abs(deltaX) > this.sensitivity) {
      deltaX > 0 ? this.nextImage() : this.prevImage();
      this.startX = currentX; // Reset starting position for smoother rotation
    }
  }

  /**
   * Stop rotation when interaction ends
   */
  stopRotation(): void {
    this.isDragging = false;
  }

  /**
   * Navigate to the previous image
   */
  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  /**
   * Navigate to the next image
   */
  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  /**
   * Extract clientX from mouse or touch event
   */
  private getClientX(event: MouseEvent | TouchEvent): number {
    return 'touches' in event ? event.touches[0].clientX : event.clientX;
  }

  /**
   * Ensure drag/touch ends are handled globally
   */
  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  handleGlobalStop(): void {
    this.stopRotation();
  }
}
