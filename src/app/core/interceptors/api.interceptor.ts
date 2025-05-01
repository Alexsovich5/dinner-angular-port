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

    // Don't add content-type for OPTIONS requests as it can cause CORS issues
    if (req.method === 'OPTIONS') {
      req = req.clone({
        setHeaders: {
          'Accept': '*/*',
        },
        withCredentials: true
      });
    } else {
      // For non-OPTIONS requests, add standard headers
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        withCredentials: true
      });
    }
  }

  // Process the request and handle errors
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';
      // Handle validation errors from FastAPI
      if (error.status === 422) {
        // FastAPI returns validation errors in a specific format
        const validationErrors = error.error?.detail || [];
        if (validationErrors.length) {
          errorMsg = validationErrors.map((err: any) =>
            `${err.loc.join('.')}: ${err.msg}`
          ).join(', ');
        } else {
          errorMsg = 'Validation error: Please check your input data';
        }
      } else if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMsg = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMsg = `Error Code: ${error.status}, Message: ${error.message || error.error?.detail || 'Unknown error'}`;

        // Handle authentication errors
        if (error.status === 401) {
          authService.logout();
        }
      }

      console.error('API Error:', error);
      return throwError(() => new Error(errorMsg));
    })
  );
};
