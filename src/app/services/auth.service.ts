import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private apiUrl = 'http://192.168.0.219:8080/api/users';

  constructor(private http: HttpClient) {}



  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };

    return this.http
      .post(`${this.apiUrl}/login`, loginData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'json', // Change this to 'json' to expect a JSON response
      })
      .pipe(
        tap((user: any) => {
          // Store user information as JSON in localStorage
          window.location.reload(); // Reloads the current page
          localStorage.setItem('user', JSON.stringify(user));

          // Optionally store user ID separately if needed
          localStorage.setItem('userId', user.id.toString()); // Uncomment if you want to store user ID separately

          this.isAuthenticated = true;

        })
      );
  }

  // Method to get user profile by email and store in localStorage
  getUserProfileByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.apiUrl}/profile`, { params }).pipe(
      tap((profile) => {
        // Store profile in localStorage
        localStorage.setItem('user', JSON.stringify(profile));
      })
    );
  }
  // Method to retrieve user profile from localStorage under key "user"
  getUserProfileFromLocalStorage(): any {
    const profile = localStorage.getItem('user');
    return profile ? JSON.parse(profile) : null;
  }

  // Method to clear user profile from localStorage (if needed)
  clearUserProfileFromLocalStorage(): void {
    localStorage.removeItem('user');
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  forgotPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);

    return this.http
      .post(`${this.apiUrl}/forgot-password`, null, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => {

          return throwError(
            () =>
              new Error(
                'Failed to send password reset email. Please try again later.'
              )
          );
        })
      );
  }

  resetPassword(data: { email: string; newPassword: string }): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('newPassword', data.newPassword);
    return this.http.put<any>(`${this.apiUrl}/reset-password`, null, {
      params,
    });
  }

  // Method to get the current user's ID from the stored token
  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId'); // Check if userId is available in localStorage
  }

  signOut(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    this.isAuthenticated = false;
    localStorage.clear();
  }
}
