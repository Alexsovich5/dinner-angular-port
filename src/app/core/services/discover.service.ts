import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscoverService {
  constructor(private http: HttpClient) {}

  getProfiles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/discover`);
  }

  likeProfile(profileId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/discover/like`, { profileId });
  }
}
