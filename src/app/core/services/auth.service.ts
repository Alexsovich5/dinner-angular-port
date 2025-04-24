import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, RegisterData } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  private errorSubject = new BehaviorSubject<string | null>(null);

  user$ = this.userSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private async checkAuthStatus(): Promise<void> {
    try {
      const { data } = await this.http.get<{success: boolean, data: {user: User}}>(`${environment.apiUrl}/auth/me`)
        .toPromise();

      if (data?.user) {
        this.userSubject.next(data.user);
        this.isAuthenticatedSubject.next(true);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  login(email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<{success: boolean, data: {user: User}}>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap({
          next: (response) => {
            if (response.success && response.data?.user) {
              this.userSubject.next(response.data.user);
              this.isAuthenticatedSubject.next(true);
            }
          },
          error: (error) => {
            this.errorSubject.next(error.message || 'Login failed');
            throw error;
          },
          finalize: () => {
            this.isLoadingSubject.next(false);
          }
        })
      );
  }

  register(userData: RegisterData): Observable<any> {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<{success: boolean, data: {user: User}}>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap({
          next: (response) => {
            if (response.success && response.data?.user) {
              this.userSubject.next(response.data.user);
              this.isAuthenticatedSubject.next(true);
            }
          },
          error: (error) => {
            this.errorSubject.next(error.message || 'Registration failed');
            throw error;
          },
          finalize: () => {
            this.isLoadingSubject.next(false);
          }
        })
      );
  }

  logout(): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.http.post(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        tap({
          next: () => {
            this.userSubject.next(null);
            this.isAuthenticatedSubject.next(false);
          },
          error: (error) => {
            console.error('Logout failed:', error);
            throw error;
          },
          finalize: () => {
            this.isLoadingSubject.next(false);
          }
        })
      );
  }

  updateProfile(userData: Partial<User>): Observable<any> {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.put<{success: boolean, data: {user: User}}>(`${environment.apiUrl}/profile`, userData)
      .pipe(
        tap({
          next: (response) => {
            if (response.success && response.data?.user) {
              this.userSubject.next({
                ...this.userSubject.value!,
                ...response.data.user
              });
            }
          },
          error: (error) => {
            this.errorSubject.next(error.message || 'Profile update failed');
            throw error;
          },
          finalize: () => {
            this.isLoadingSubject.next(false);
          }
        })
      );
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}
