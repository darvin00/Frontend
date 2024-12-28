
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports-analytics.component.html',
  styleUrls: ['./reports-analytics.component.scss'],
})
export class ReportsAnalyticsComponent implements OnInit {
  offerForm!: FormGroup;
  isSending: boolean = false; // Flag for sending state
  isSent: boolean = false; // Flag for sent state

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.offerForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  sendOffer() {
    if (this.offerForm.valid) {
      this.isSending = true; // Set "sending" state
      this.http.post<{ message: string }>('http://192.168.0.219:8080/api/send-offer', this.offerForm.value).subscribe({
        next: (response) => {

          this.isSending = false;
          this.isSent = true;
          alert('Offer sent successfully!'); // Notify the user
          this.offerForm.reset(); // Reset the form to its initial state

          // After 3 seconds, reset to 'Send Offer' state
          setTimeout(() => {
            this.isSent = false;
          }, 3000); // 3000 ms = 3 seconds
        },
        error: (error) => {

          this.isSending = false;
          alert('Failed to send the offer. Please try again.');
        }
      });
    }
  }


}
