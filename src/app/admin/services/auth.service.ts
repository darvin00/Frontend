import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const BASIC_URL = 'http://192.168.0.219:8080/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // register(signupRequest: any): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   return this.http.post<any>(`${BASIC_URL}/adminlogin`, signupRequest, { headers })
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  adminlogin(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const loginData = { email, password };

    return this.http
      .post<any>(`${BASIC_URL}/adminlogin`, loginData, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {

    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }

  logout(): void {}
}
