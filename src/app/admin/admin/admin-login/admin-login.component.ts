import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-adminlogin',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  // Component code

  loginForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

   ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.error('Please fill in the required fields correctly', 'Validation Error', { timeOut: 5000 });
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.adminlogin(email, password).subscribe(
      (res) => {
            localStorage.setItem('adminToken', 'your-token-here');
        this.toastr.success('Login successful', 'Success', );
        this.router.navigate(['/dashboard']);  // Redirect to dashboard or any other route after successful login
      },
      (error) => {
        this.toastr.error('Invalid credentials', 'Error', );
      }
    );
  }
  animateButton(event: MouseEvent) {
  const target = event.currentTarget as HTMLButtonElement;
  target.classList.add('clicked');

  setTimeout(() => {
    target.classList.remove('clicked');
  }, 500); // Duration matches the CSS transition time
}

}

