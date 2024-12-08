import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation/reservation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-receptionist-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTableModule
  ],
  providers: [ReservationService]
})
export class ReceptionistHomeComponent implements OnInit {
  reservations: any[] = [];
  filteredCheckInReservations: any[] = [];
  filteredCheckOutReservations: any[] = [];
  checkInDate: Date = new Date();
  checkOutDate: Date = new Date();
  displayedColumnsCheckIn: string[] = ['reservationId', 'roomId', 'guestId', 'checkInDate', 'checkOutDate', 'paymentStatus'];
displayedColumnsCheckOut: string[] = ['reservationId', 'roomId', 'guestName', 'checkInDate', 'checkOutDate', 'paymentStatus'];

  constructor(private reservationService: ReservationService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllBookings().subscribe({
      next: data => {
        this.reservations = data;
        this.applyFilter();
      },
      error: () => {
        this.snackBar.open('Failed to load reservations. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  applyFilter(): void {
    this.filteredCheckInReservations = this.reservations.filter(reservation => {
      const checkInMatch = new Date(reservation.checkInDate).toDateString() === this.checkInDate.toDateString();
      const paymentStatusMatch = reservation.paymentStatus === 'Successful';
      return checkInMatch && paymentStatusMatch;
    });

    this.filteredCheckOutReservations = this.reservations.filter(reservation => {
      const checkOutMatch = new Date(reservation.checkOutDate).toDateString() === this.checkOutDate.toDateString();
      const paymentStatusMatch = reservation.paymentStatus === 'Successful';
      return checkOutMatch && paymentStatusMatch;
    });
  }
}