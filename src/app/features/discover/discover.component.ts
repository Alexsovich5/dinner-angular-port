import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DiscoverService } from '../../core/services/discover.service';

interface PotentialMatch {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bio: string;
  profilePictures: string[];
  interests: string[];
  dietaryPreferences: string[];
  distance: number;
  matchPercentage?: number;
  lastActive?: Date;
}

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
  animations: [
    trigger('cardAnimation', [
      state('default', style({
        transform: 'none'
      })),
      state('like', style({
        transform: 'translate(150%) rotate(30deg)',
        opacity: 0
      })),
      state('dislike', style({
        transform: 'translate(-150%) rotate(-30deg)',
        opacity: 0
      })),
      transition('default => like', animate('400ms ease-out')),
      transition('default => dislike', animate('400ms ease-out'))
    ])
  ]
})
export class DiscoverComponent implements OnInit {
  profiles: PotentialMatch[] = [];
  currentMatch: PotentialMatch | null = null;
  isLoading = false;
  error: string | null = null;
  animationState = 'default';
  swipeCoord?: [number, number];
  swipeTime?: number;
  showSwipeHint = true;
  readonly SWIPE_THRESHOLD = 50;

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

  onSwipeStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.swipeCoord = [touch.clientX, touch.clientY];
    this.swipeTime = Date.now();
  }

  onSwipeEnd(event: TouchEvent): void {
    if (!this.swipeCoord || !this.swipeTime || !this.currentMatch) return;

    const touch = event.changedTouches[0];
    const swipeDuration = Date.now() - this.swipeTime;
    const xDiff = touch.clientX - this.swipeCoord[0];
    const yDiff = touch.clientY - this.swipeCoord[1];

    if (swipeDuration < 1000 && Math.abs(xDiff) > this.SWIPE_THRESHOLD && Math.abs(yDiff) < 100) {
      // Horizontal swipe
      if (xDiff > 0) {
        this.animationState = 'like';
        setTimeout(() => this.onLike(this.currentMatch!._id), 400);
      } else {
        this.animationState = 'dislike';
        setTimeout(() => this.onDislike(this.currentMatch!._id), 400);
      }
      this.showSwipeHint = false;
    }

    this.swipeCoord = undefined;
    this.swipeTime = undefined;
  }

  onSwipeMove(event: TouchEvent): void {
    if (!this.swipeCoord) return;

    const touch = event.touches[0];
    const xDiff = touch.clientX - this.swipeCoord[0];
    const rotation = xDiff * 0.1; // Subtle rotation while dragging

    const element = event.currentTarget as HTMLElement;
    element.style.transform = `translateX(${xDiff}px) rotate(${rotation}deg)`;
  }

  private moveToNextProfile(currentProfileId: string): void {
    const currentIndex = this.profiles.findIndex(p => p._id === currentProfileId);
    this.profiles = this.profiles.filter(profile => profile._id !== currentProfileId);

    if (this.profiles.length > 0) {
      this.currentMatch = this.profiles[0];
      this.animationState = 'default';
    } else {
      this.currentMatch = null;
      this.loadProfiles();
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

  isRecentlyActive(lastActive: Date): boolean {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
    return diffMinutes < 15; // Consider active if less than 15 minutes ago
  }

  getLastActiveText(lastActive: Date): string {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Online now';
    if (diffMinutes < 60) return `Active ${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Active ${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `Active ${diffDays}d ago`;
  }
}
