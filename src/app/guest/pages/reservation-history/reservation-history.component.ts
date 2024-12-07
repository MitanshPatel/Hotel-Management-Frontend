import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/room/room.service';
import { ReservationService } from '../../../services/reservation/reservation.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule
  ],
  providers :[DatePipe]
})
export class ReservationHistoryComponent implements OnInit {
  reservations: any[] = [];

  constructor(
    private reservationService: ReservationService,
    private roomService: RoomService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe(data => {
      this.reservations = data;
      this.loadRoomDetails();
      this.reservations.sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());
    });
  }

  loadRoomDetails(): void {
    this.reservations.forEach(reservation => {
      this.roomService.getRoomById(reservation.roomId).subscribe(room => {
        reservation.roomType = room.roomType;
        reservation.view = room.view;
        reservation.bedType = room.bedType;
        reservation.rating = room.rating;
        reservation.checkInDate = this.datePipe.transform(reservation.checkInDate, 'dd-MM-yyyy HH:mm');
        reservation.checkOutDate = this.datePipe.transform(reservation.checkOutDate, 'dd-MM-yyyy HH:mm');
      });
    });
  }

  getStatusText(reservation: any): string {
    if (reservation.status === 'Pending') {
      return 'Awaiting Approval';
    } if(reservation.status === 'Approved' && reservation.paymentStatus !== 'Successful'){
      return 'Awaiting Payment';
    }
     else if (reservation.status === 'Approved' && reservation.paymentStatus === 'Successful') {
      return 'Paid';
    } else if (reservation.status === 'Approved') {
      return 'Approved';
    } else {
      return reservation.status;
    }
  }

  viewDetails(reservation: any): void {
    // Implement view details logic here
    this.snackBar.open('Viewing details for reservation #' + reservation.reservationId, 'Close', {
      duration: 3000,
    });
  }

  cancelReservation(reservation: any): void {
    // Implement cancel reservation logic here
    this.snackBar.open('Cancelling reservation #' + reservation.reservationId, 'Close', {
      duration: 3000,
    });
  }

  makePayment(reservation: any): void {
    // Implement make payment logic here
    this.snackBar.open('Making payment for reservation #' + reservation.reservationId, 'Close', {
      duration: 3000,
    });
  }
}