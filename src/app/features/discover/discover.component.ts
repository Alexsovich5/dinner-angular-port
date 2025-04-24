import { Component, OnInit } from '@angular/core';
import { DiscoverService } from '../../core/services/discover.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  profiles: any[] = [];
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
      },
      error: (err) => {
        this.error = err.message || 'Failed to load profiles';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onLike(profileId: string): void {
    this.discoverService.likeProfile(profileId).subscribe({
      next: () => {
        this.profiles = this.profiles.filter(profile => profile.id !== profileId);
      },
      error: (err) => {
        console.error('Failed to like profile:', err);
      }
    });
  }

  onDislike(profileId: string): void {
    this.profiles = this.profiles.filter(profile => profile.id !== profileId);
  }
}
