import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  addShift(shift: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${environment.apiUrl}/staff-schedule/shifts`, shift, { headers });
  }

  getMySchedule(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/staff-schedule/my-schedule`, { headers });
  }

  startShift(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${environment.apiUrl}/staff-schedule/start`, {}, { headers });
  }

  endShift(scheduleId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${environment.apiUrl}/staff-schedule/${scheduleId}/end`, {}, { headers });
  }
}