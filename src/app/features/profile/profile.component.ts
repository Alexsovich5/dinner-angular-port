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

  // Options for select fields
  dietaryOptions = [
    'vegetarian', 'vegan', 'pescatarian', 'gluten-free',
    'dairy-free', 'kosher', 'halal', 'keto', 'paleo',
    'no restrictions', 'other'
  ];

  genderOptions = ['male', 'female', 'non-binary'];

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(500)]],
      profilePicture: [null],
      interests: [[]],
      dietaryPreferences: [[]],
      locationPreferences: this.fb.group({
        city: [''],
        maxDistance: [30, [Validators.min(5), Validators.max(100)]]
      }),
      matchPreferences: this.fb.group({
        ageRange: this.fb.group({
          min: [21, [Validators.required, Validators.min(18)]],
          max: [65, [Validators.required, Validators.max(99)]]
        }),
        genders: [[]]
      })
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

  addInterest(interest: string): void {
    if (!interest.trim()) return;
    const interests = this.profileForm.get('interests')?.value || [];
    if (!interests.includes(interest.trim())) {
      this.profileForm.patchValue({
        interests: [...interests, interest.trim()]
      });
    }
  }

  removeInterest(interest: string): void {
    const interests = this.profileForm.get('interests')?.value || [];
    this.profileForm.patchValue({
      interests: interests.filter((i: string) => i !== interest)
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      const formData = new FormData();
      Object.keys(this.profileForm.value).forEach((key) => {
        if (key === 'locationPreferences' || key === 'matchPreferences') {
          formData.append(key, JSON.stringify(this.profileForm.value[key]));
        } else {
          formData.append(key, this.profileForm.value[key]);
        }
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
