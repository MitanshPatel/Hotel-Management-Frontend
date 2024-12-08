import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getReservations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservation`, { headers: this.getAuthHeaders() });
  }

  getAvailableRooms(checkInDate: string, checkOutDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservation/available-rooms`, {
      headers: this.getAuthHeaders(),
      params: { checkInDate, checkOutDate }
    });
  }

  getRoomDetails(roomId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/room/${roomId}`, {
      headers: this.getAuthHeaders()
    });
  }

  checkRoomAvailability(roomId: string, checkInDate: string, checkOutDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservation/room-availability-check`, {
      headers: this.getAuthHeaders(),
      params: { roomId, checkInDate, checkOutDate }
    });
  }

  createReservation(reservation: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reservation`, reservation, {
      headers: this.getAuthHeaders()
    });
  }

  getAllBookings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservation-management/all`, { headers: this.getAuthHeaders() });
  }

  getPendingBookings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservation-management/pending`, { headers: this.getAuthHeaders() });
  }

  getApprovedBookings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservation-management/approved`, { headers: this.getAuthHeaders() });
  }

  getRejectedBookings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reservation-management/rejected`, { headers: this.getAuthHeaders() });
  }

  updateBookingStatus(reservationId: number, status: string): Observable<any> {
    const body = { status };
    return this.http.put<any>(`${this.apiUrl}/reservation-management/${reservationId}/status`, body, {
      headers: this.getAuthHeaders()
    });
  }

  cancelReservation(reservationId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reservation/${reservationId}/cancel`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  getRoomReviews(roomId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reviews/room/${roomId}`, { headers: this.getAuthHeaders() });
  }

  addReview(review: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reviews`, review, { headers: this.getAuthHeaders() });
  }
}