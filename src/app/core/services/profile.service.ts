import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  interests: string[];
  dietaryPreferences: string[];
  locationPreferences: {
    city: string;
    maxDistance: number;
  };
  matchPreferences: {
    ageRange: {
      min: number;
      max: number;
    };
    genders: string[];
  };
}

interface ProfilePictureResponse {
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = `${environment.apiUrl}/profile`;

  constructor(private readonly http: HttpClient) {}

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.apiUrl);
  }

  updateProfile(formData: FormData): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(this.apiUrl, formData);
  }

  uploadProfilePicture(file: File): Observable<ProfilePictureResponse> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return this.http.post<ProfilePictureResponse>(`${this.apiUrl}/picture`, formData);
  }
}
