import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      profilePicture: [null]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load profile';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      const formData = new FormData();
      Object.keys(this.profileForm.value).forEach((key) => {
        formData.append(key, this.profileForm.value[key]);
      });

      this.profileService.updateProfile(formData).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully';
        },
        error: (err) => {
          this.error = err.message || 'Failed to update profile';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileForm.patchValue({ profilePicture: input.files[0] });
    }
  }
}
