import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreferencesService } from '../../core/services/preferences.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  preferencesForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private preferencesService: PreferencesService) {
    this.preferencesForm = this.fb.group({
      foodPreferences: ['', [Validators.required]],
      dietaryRestrictions: [''],
      location: ['', [Validators.required]],
      ageRange: this.fb.group({
        min: [18, [Validators.required, Validators.min(18)]],
        max: [50, [Validators.required, Validators.max(100)]]
      }),
      genders: ['']
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    this.isLoading = true;
    this.preferencesService.getPreferences().subscribe({
      next: (preferences) => {
        this.preferencesForm.patchValue(preferences);
      },
      error: (err) => {
        this.error = err.message || 'Failed to load preferences';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.preferencesForm.valid) {
      this.isLoading = true;
      this.successMessage = null;
      this.error = null;

      this.preferencesService.updatePreferences(this.preferencesForm.value).subscribe({
        next: () => {
          this.successMessage = 'Preferences updated successfully';
        },
        error: (err) => {
          this.error = err.message || 'Failed to update preferences';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
