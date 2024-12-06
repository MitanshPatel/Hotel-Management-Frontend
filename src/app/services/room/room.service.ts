import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = `${environment.apiUrl}/room`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getRooms(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getRoomById(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${roomId}`, { headers: this.getAuthHeaders() });
  }

  addRoom(room: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, room, { headers: this.getAuthHeaders() });
  }

  updateRoom(roomId: number, room: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${roomId}`, room, { headers: this.getAuthHeaders() });
  }

  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${roomId}`, { headers: this.getAuthHeaders() });
  }
}