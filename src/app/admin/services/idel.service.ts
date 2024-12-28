import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, merge } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private timeout = 20 * 60 * 1000; // 20 minutes in milliseconds
  private inactivityTimer: any;

  constructor(private router: Router, private ngZone: NgZone) {
    this.startWatching();
  }

  startWatching() {
    this.ngZone.runOutsideAngular(() => {
      const events$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'scroll')
      ).pipe(debounceTime(1000)); // Debounce to reduce event frequency

      events$.subscribe(() => this.resetTimer());

      this.resetTimer(); // Start timer initially
    });
  }

  private resetTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => this.logout(), this.timeout);
  }

  private logout() {
    // Clear session data if necessary
    localStorage.removeItem('userSession'); // Adjust if using different storage
    this.router.navigate(['/login']);
  }
}