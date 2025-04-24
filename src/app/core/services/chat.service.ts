import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messageSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  getMessageHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/chat/history`);
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/chat/send`, { message });
  }

  listenForMessages(): Observable<any> {
    // Simulate real-time messaging using a Subject
    return this.messageSubject.asObservable();
  }

  simulateIncomingMessage(message: any): void {
    this.messageSubject.next(message);
  }
}
