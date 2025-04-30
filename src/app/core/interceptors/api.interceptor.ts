import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const ApiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Check if the request is going to our API
  if (req.url.includes(environment.apiUrl)) {
    // Get the auth token if available
    const token = authService.getToken();

    // Clone the request and add headers
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      // Make sure credentials are included for CORS
      withCredentials: true
    });
  }

  // Process the request and handle errors
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMsg = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;

        // Handle authentication errors
        if (error.status === 401) {
          authService.logout();
        }
      }

      console.error(errorMsg);
      return throwError(() => new Error(errorMsg));
    })
  );
};
