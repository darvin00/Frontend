import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
})
export class CustomerComponent implements OnInit {
  testimonials: any[] = [];
  activeIndex = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTestimonials();
  }

  fetchTestimonials() {
    this.http
      .get<any[]>('http://192.168.0.219:8080/api/admin/customers/get')
      .subscribe(
        (data) => {
          this.testimonials = data;
        },
        (error) => {

        }
      );
  }

  prev() {
    this.activeIndex =
      this.activeIndex > 0
        ? this.activeIndex - 1
        : this.testimonials.length - 1;
  }

  next() {
    this.activeIndex =
      this.activeIndex < this.testimonials.length - 1
        ? this.activeIndex + 1
        : 0;
  }
}
