import { Component, OnInit } from '@angular/core';
import { DiscoverService } from '../../core/services/discover.service';

interface PotentialMatch {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bio?: string;
  interests?: string[];
  profilePictures: string[];
  dietaryPreferences?: string[];
  distance?: number;
  age?: number;
}

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  profiles: PotentialMatch[] = [];
  currentMatch: PotentialMatch | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private discoverService: DiscoverService) {}

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.isLoading = true;
    this.error = null;

    this.discoverService.getProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        if (profiles.length > 0) {
          this.currentMatch = profiles[0];
        }
      },
      error: (err) => {
        this.error = err.message || 'Failed to load potential matches';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onLike(profileId: string): void {
    this.discoverService.likeProfile(profileId).subscribe({
      next: () => {
        this.moveToNextProfile(profileId);
      },
      error: (err) => {
        console.error('Failed to like profile:', err);
      }
    });
  }

  onDislike(profileId: string): void {
    this.moveToNextProfile(profileId);
  }

  private moveToNextProfile(currentProfileId: string): void {
    const currentIndex = this.profiles.findIndex(p => p._id === currentProfileId);
    this.profiles = this.profiles.filter(profile => profile._id !== currentProfileId);

    if (this.profiles.length > 0) {
      this.currentMatch = this.profiles[0];
    } else {
      this.currentMatch = null;
      this.loadProfiles(); // Load more profiles when we run out
    }
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
