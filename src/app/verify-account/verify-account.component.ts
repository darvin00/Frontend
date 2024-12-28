import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
})
export class VerifyAccountComponent implements OnInit {
  verificationToken: string | null = null;
  verificationMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the token from the URL
    this.verificationToken = this.route.snapshot.queryParamMap.get('token');
    if (this.verificationToken) {
      this.verifyAccount(this.verificationToken);
    } else {
      this.verificationMessage = 'No verification token found.';
    }
  }

  verifyAccount(token: string): void {
    this.http
      .get(`http://192.168.0.219:8080/api/users/verify?token=${token}`)
      .subscribe({
        next: (response: any) => {
          this.verificationMessage =
            'Account successfully verified. Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/toggle']); // Redirect to login after verification
          }, 3000);
        },
        error: (error: any) => {
          this.verificationMessage = 'Verification failed: ' + error.error;
        },
      });
  }
}
