import { Component } from '@angular/core';

@Component({
  selector: 'app-image-360-view',
  templateUrl: './image-360-view.component.html',
  styleUrls: ['./image-360-view.component.css']
})
export class Image360ViewComponent {
  images: string[] = [
    'assets/images/360 images/Screenshot 2024-08-19 141759.png', 'assets/images/360 images/Screenshot 2024-08-19 141811.png',
    'assets/images/360 images/Screenshot 2024-08-19 141827.png', 'assets/images/360 images/Screenshot 2024-08-19 141827.png',
    'assets/images/360 images/Screenshot 2024-08-19 141838.png', 'assets/images/360 images/Screenshot 2024-08-19 141838.png',
    'assets/images/360 images/Screenshot 2024-08-19 141905.png', 'assets/images/360 images/Screenshot 2024-08-19 141916.png'
  ];

  currentIndex = 0;
  isDragging = false;
  startX: number = 0;

  startRotation(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.startX = this.isTouchEvent(event) ? event.touches[0].clientX : (event as MouseEvent).clientX;
  }

  rotateImage(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    const currentX = this.isTouchEvent(event) ? event.touches[0].clientX : (event as MouseEvent).clientX;
    const deltaX = this.startX - currentX;

    if (Math.abs(deltaX) > 10) {  // Adjust sensitivity
      if (deltaX > 0) {
        this.nextImage();
      } else {
        this.prevImage();
      }
      this.startX = currentX;
    }
  }

  stopRotation() {
    this.isDragging = false;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
  }

  private isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return 'touches' in event;
  }
}
