import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-attendance-history',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './attendance-history.component.html',
  styleUrl: './attendance-history.component.css'
})
export class AttendanceHistoryComponent implements OnInit {
  attendanceHistory: any[] = [];

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    });
  }

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/staff-schedule`, { headers: this.getAuthHeaders() }).subscribe(data => {
      this.attendanceHistory = data.sort((a, b) => new Date(b.shiftStartTime).getTime() - new Date(a.shiftStartTime).getTime());
    }, error => {
      console.error('Error fetching attendance history:', error);
    });
  }
}
