import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service'; // Adjust path as needed

@Component({
  selector: 'app-register',
  template: `<!-- Template for RegisterComponent -->`, // Use inline template
  // styleUrls: ['./register.component.scss'] // Removed as file not found
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = null; // Reset error message
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    if (this.registerForm.hasError('mismatch')) {
        this.errorMessage = 'Passwords do not match.';
        return;
    }

    this.isLoading = true;
    const { email, password } = this.registerForm.value;

    this.authService.register(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          // Optionally show a success message or redirect immediately
          this.router.navigate(['/auth/login']); // Redirect to login page after successful registration
        },
        error: (err) => {
          this.isLoading = false;
          // Handle specific error messages from the backend if available
          this.errorMessage = err.message || 'Registration failed. Please try again.';
          console.error('Registration error:', err);
        }
      });
  }

  // Helper getters for easy access in the template
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  registerForm!: FormGroup;
  isLoading = false;
