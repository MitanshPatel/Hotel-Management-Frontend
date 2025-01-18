import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent {
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private snackBar: MatSnackBar) {}

  applyLeave() {
    if (this.startDate && this.endDate) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const currentUser = this.authService.currentUserValue;
      const staffId = currentUser.userId;
      const leaveRequest = {
        leaveRequestId: 0,
        staffId,
        startDate: this.startDate.toISOString(),
        endDate: this.endDate.toISOString(),
        status: 'Pending'
      };

      this.http.post(`${environment.apiUrl}/leave-request`, leaveRequest, { headers })
        .subscribe({
          next: (response) => {
            this.snackBar.open('Leave request submitted successfully', 'Close', {
              duration: 3000,
            });
          },
          error: (error) => {
            this.snackBar.open('Error submitting leave request', 'Close', {
              duration: 3000,
            });
          }
        });
    } else {
      this.snackBar.open('Please select a valid date range', 'Close', {
        duration: 3000,
      });
    }
  }
}