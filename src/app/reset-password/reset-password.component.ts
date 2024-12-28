import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  message: string = '';
  urlEmail: string | null = '';
  showPassword: boolean = false; // To toggle password visibility
  isSubmitting = false;
  isSuccess = false;


  constructor(
    private fb: FormBuilder,
    private userService: AuthService,
    private router: Router,
    private route: ActivatedRoute // ActivatedRoute to access URL parameters
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Extract the 'email' from the URL query params
    this.route.queryParams.subscribe(params => {
      this.urlEmail = params['email'] || null;
    });
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.resetForm.valid) {
      const { email, newPassword } = this.resetForm.value;
      this.isSubmitting = true;

      if (this.urlEmail && email === this.urlEmail) {
        this.userService.resetPassword({ email, newPassword }).subscribe({
          next: (response) => {
            this.message = response.message || 'Password reset successfully.';
            this.isSuccess = false;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Password reset successfully!',
              confirmButtonText: 'OK'
            }).then(() => {
              this.resetForm.reset();
              this.router.navigate(['/shine/shinehome']);
            });
            setTimeout(() => {
              // Simulating success after 2 seconds
              this.isSubmitting = false;
              this.isSuccess = true;
            }, 2000);
          },
          error: (error) => {
            this.isSuccess = false;

            this.message = error.error || 'Password reset failed. Please try again.';
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: this.message,
              confirmButtonText: 'OK'
            });
          }
        });
      } else {
        this.isSuccess = false;
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter the valid email address provided in the reset link.',
          confirmButtonText: 'OK'
        });
      }
    } else {
      this.isSuccess = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill out the form correctly.',
        confirmButtonText: 'OK'
      });
    }
  }
}
