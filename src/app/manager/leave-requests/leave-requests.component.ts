import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';

interface LeaveRequest {
  leaveRequestId: number;
  staffId: number;
  startDate: string;
  endDate: string;
  status: string;
}

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css']
})
export class LeaveRequestsComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<LeaveRequest[]>(`${environment.apiUrl}/leave-request`, { headers })
      .subscribe({
        next: (response) => {
          this.leaveRequests = response;
        },
        error: (error) => {
          this.snackBar.open('Error loading leave requests', 'Close', {
            duration: 3000,
          });
        }
      });
  }

  approveLeaveRequest(leaveRequestId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.put(`${environment.apiUrl}/leave-request/${leaveRequestId}/approve`, {}, { headers })
      .subscribe({
        next: () => {
          this.snackBar.open('Leave request approved', 'Close', {
            duration: 3000,
          });
          this.loadLeaveRequests();
        },
        error: (error) => {
          this.snackBar.open('Error approving leave request', 'Close', {
            duration: 3000,
          });
        }
      });
  }

  rejectLeaveRequest(leaveRequestId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.put(`${environment.apiUrl}/leave-request/${leaveRequestId}/reject`, {}, { headers })
      .subscribe({
        next: () => {
          this.snackBar.open('Leave request rejected', 'Close', {
            duration: 3000,
          });
          this.loadLeaveRequests();
        },
        error: (error) => {
          this.snackBar.open('Error rejecting leave request', 'Close', {
            duration: 3000,
          });
        }
      });
  }
}