import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @Input() isLogin!: boolean;
  @Output() toggleLogin = new EventEmitter<boolean>(); // Event to notify parent component
  showPassword = false;  
  isSubmitting = false; 
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
    isRegistering: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private signupService: AuthService,
    private router: Router,
    private toastr: ToastrService,
        private authService: AuthService,
  ) { this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });}

  ngOnInit(): void {
   
  }
 // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  

 onRegister() {
   if (this.registerForm.valid) {
     this.isSubmitting = true;
       this.isRegistering = true;
      this.authService.register(this.registerForm.value).subscribe(
        (response: any) => {
          // this.successMessage = 'Verification email sent. Please check your email.';
          this.toastr.success(this.successMessage);
            Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Signup successfully!  Verification email sent. Please check your email.' ,
        confirmButtonText: 'OK'
            }).then(() => {
        this.isRegistering = false;
        this.registerForm.reset();
        this.isSubmitting = false; // Reset submitting flag
         // Detect screen size
          const screenWidth = window.innerWidth;

          // If screen width is less than 768px (mobile), route directly to login
          if (screenWidth < 768) {
            this.router.navigate(['/login']); // Navigate to login page
          } else {
            // If tablet or laptop, toggle the login/signup form
           this.router.navigate(['/toggle']);
          }
      });
        },
        (error) => {
          this.errorMessage = error.error.message || 'Registration failed';
          // Hide the error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = ''; // Clear the error message after 5 seconds
        }, 5000);

       this.isRegistering = false;

        this.isSubmitting = false; // Reset submitting flag
      }
      );
    }
  }



  
}


 

