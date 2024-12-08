import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AttendanceService } from '../services/attendance/attendance.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.css']
})
export class MarkAttendanceComponent implements OnInit {
  shift: any = {};
  errorMessage: string = '';
  today: Date = new Date();
  shiftTimeRange: string = '';
  shiftStartTime: string | null = null;
  shiftEndTime: string | null = null;
  scheduleId: number | null = null;
  attendanceMarked: boolean = false;

  constructor(
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MarkAttendanceComponent>
  ) {}

  async ngOnInit() {
    try {
      const data = await lastValueFrom(this.attendanceService.getMySchedule());
      this.attendanceMarked = data.attendance;
      this.shift = data.schedule;
      this.calculateShiftTimeRange();

      if (this.attendanceMarked) {
        this.scheduleId = this.shift.scheduleId;
        this.shiftStartTime = this.shift.shiftStartTime;
        this.shiftEndTime = this.shift.shiftEndTime;
      } else {
        this.shiftStartTime = localStorage.getItem('shiftStartTime');
        const scheduleId = localStorage.getItem('scheduleId');
        if (scheduleId) {
          this.scheduleId = parseInt(scheduleId, 10);
        }
      }
    } catch (error) {
      console.error('Failed to load schedule', error);
      this.errorMessage = (error as any).error?.msg || 'Failed to load schedule';
      this.snackBar.open(this.errorMessage, 'Close', {
        duration: 3000,
      });
    }
  }

  calculateShiftTimeRange() {
    switch (this.shift.shiftType) {
      case 'Morning':
        this.shiftTimeRange = '6:00 AM - 12:00 PM';
        break;
      case 'Afternoon':
        this.shiftTimeRange = '12:00 PM - 6:00 PM';
        break;
      case 'Evening':
        this.shiftTimeRange = '6:00 PM - 12:00 AM';
        break;
      case 'Night':
        this.shiftTimeRange = '12:00 AM - 6:00 AM';
        break;
      default:
        this.shiftTimeRange = '';
        break;
    }
  }

  async checkIn() {
    try {
      const data = await lastValueFrom(this.attendanceService.startShift());
      this.scheduleId = data.schedule.scheduleId;
      this.shiftStartTime = data.schedule.shiftStartTime;
      if (this.scheduleId !== null) {
        localStorage.setItem('scheduleId', this.scheduleId.toString());
      }
      if (this.shiftStartTime) {
        localStorage.setItem('shiftStartTime', this.shiftStartTime);
      }
      this.snackBar.open(data.message, 'Close', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Check-in failed', error);
      const errorMessage = (error as any).error?.msg || 'Check-in failed';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 3000,
      });
    }
  }

  async checkOut() {
    if (this.scheduleId) {
      try {
        const data = await lastValueFrom(this.attendanceService.endShift(this.scheduleId));
        localStorage.removeItem('scheduleId');
        localStorage.removeItem('shiftStartTime');
        this.snackBar.open(data.msg, 'Close', {
          duration: 3000,
        });
        this.dialogRef.close();
      } catch (error) {
        console.error('Check-out failed', error);
        const errorMessage = (error as any).error?.msg || 'Check-out failed';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
        });
      }
    }
  }
}