import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { userInfo } from 'os';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
// email: string = '';
//   password: string = '';
  loginForm: FormGroup;
  @Input() isLogin!: boolean;
  showPassword = false;
  errorMessage: string = '';
   isLoggingIn: boolean = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {
   this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
    // Toggle password visibility
    togglePasswordVisibility() {
           this.showPassword = !this.showPassword;
  }

onSubmit(): void {
  if (this.loginForm.valid) {
       this.isLoggingIn = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        // Assuming 'user' is the returned user object
        localStorage.setItem('user', JSON.stringify(user)); // Store user data
        this.router.navigate(['/shine/shinehome']); // Redirect to the home page
         Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Login successfully!',
        confirmButtonText: 'OK'
      }).then(() => {
        // Reset the form after the popup is closed
        // this.resetForm.reset();
      });
         this.isLoggingIn = false;
      },
      error: (errorResponse) => {

        this.isLoggingIn = false;
  // Handle the case when the response is plain text or not valid JSON
  if (typeof errorResponse.error === 'string') {
    this.errorMessage = errorResponse.error; // Handle as plain text
  } else if (errorResponse.error && errorResponse.error.message) {
    this.errorMessage = errorResponse.error.message; // Handle as JSON
  } else {
    this.errorMessage = 'Login failed. Please try again.';
  }
  
}
    });
  }
}

  }

 
