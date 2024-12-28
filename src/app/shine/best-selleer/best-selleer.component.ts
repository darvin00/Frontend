import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-best-selleer',
  templateUrl: './best-selleer.component.html',
  styleUrls: ['./best-selleer.component.scss']
})
export class BestSelleerComponent implements OnInit, OnDestroy {
  images = [
    'assets/images/shine/slide/slide1.webp',
    'assets/images/shine/slide/slide2.webp',
    'assets/images/shine/slide/slide1.webp',
    'assets/images/shine/slide/slide2.webp',
    'assets/images/shine/slide/slide1.webp',
    'assets/images/shine/slide/slide2.webp',
    'assets/images/shine/slide/slide1.webp',
    'assets/images/shine/slide/slide2.webp',
    'assets/images/shine/slide/slide1.webp',
    'assets/images/shine/slide/slide2.webp',
  ];

  imageLinks = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3',
    'https://example.com/page4',
    'https://example.com/page5',
    'https://example.com/page6',
    'https://example.com/page7',
    'https://example.com/page8',
    'https://example.com/page9',
    'https://example.com/page10',
  ];

  currentIndex = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 2000); // Change slide every 2 seconds
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    clearInterval(this.intervalId); // Stop auto-slide when clicked
    this.startAutoSlide(); // Restart auto-slide
  }
}
