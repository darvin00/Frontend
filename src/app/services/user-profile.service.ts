import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://192.168.0.219:8080/api/users';
  private user: User | null = null;

  constructor(private http: HttpClient) {}

  getUserProfileByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.apiUrl}/profile`, { params });
  }

  updateProfile(userId: number, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/update/${userId}`;
    return this.http.put(url, formData, {
      headers: new HttpHeaders({
        enctype: 'multipart/form-data', // Important to let the server know it's form data
      }),
    });
  }

  // Retrieve user ID dynamically
  getUserId(): Observable<number | null> {
    const userId = localStorage.getItem('userId');

    return of(userId ? parseInt(userId, 10) : null);
  }
  // Sign out the user
  signOut(): void {
    this.user = null;
    localStorage.removeItem('userId'); // Clear the user ID from storage if needed

    // Implement any additional sign-out logic here, such as clearing tokens
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return this.user !== null;
  }
}
