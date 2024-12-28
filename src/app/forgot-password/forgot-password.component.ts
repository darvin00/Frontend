// forgot-password.component.ts
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service'; // Adjust the path based on your project structure
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email: string = '';
   isSubmitting: boolean = false;


constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isSubmitting = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
       
         // Show success popup
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your Link Sent successfully!',
        confirmButtonText: 'OK'
      }).then(() => {
        // Reset the form after the popup is closed
        // this.email.reset();
      });
       this.router.navigate(['/shine/shinehome']);
      },
      error: (error) => {
         this.isSubmitting = false;

        // Show error popup if form is invalid
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill out the form correctly.',
        confirmButtonText: 'OK'
      })
      }
    });
  }
}
