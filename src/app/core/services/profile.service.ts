import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/profile`);
  }

  updateProfile(profileData: FormData): Observable<any> {
    return this.http.put(`${environment.apiUrl}/profile`, profileData);
  }
}
