import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/room/room.service';
import { ReservationService } from '../../../services/reservation/reservation.service';
import { PaymentService } from '../../../services/payment/payment.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
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
  providers: [DatePipe]
})
export class ReservationHistoryComponent implements OnInit {
  reservations: any[] = [];
  currentDate: Date = new Date();

  constructor(
    private reservationService: ReservationService,
    private roomService: RoomService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private router: Router
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
    this.snackBar.open('Viewing details for reservation #' + reservation.reservationId, 'Close', {
      duration: 3000,
    });
  }

  cancelReservation(reservation: any): void {
    this.reservationService.cancelReservation(reservation.reservationId).subscribe(() => {
      this.snackBar.open('Reservation #' + reservation.reservationId + ' cancelled.', 'Close', {
        duration: 3000,
      });
      this.loadReservations();
    });
  }

  makePayment(reservation: any): void {
    const payment = {
      paymentId: 0,
      reservationId: reservation.reservationId,
      amount: reservation.totalAmount,
      paymentMethod: 'Credit Card',
      paymentFor: 'Booking',
      paymentDate: new Date().toISOString(),
      status: 'Successful'
    };

    this.paymentService.makePayment(payment).subscribe(response => {
      this.snackBar.open(response.msg, 'Close', {
        duration: 3000,
      });
      this.loadReservations();
    });
  }

  orderFood(reservationId: number): void {
    this.router.navigate(['/guest/order', reservationId]);
  }

  parseDate(dateString: string): Date {
    const [day, month, year, time] = dateString.split(/[-\s:]/);
    return new Date(`${year}-${month}-${day}`);
  }

  isBeforeToday(dateString: string): boolean {
    return this.parseDate(dateString) > this.currentDate;
  }

  isBetweenDates(startDateString: string, endDateString: string): boolean {
    const startDate = this.parseDate(startDateString);
    const endDate = this.parseDate(endDateString);
    return this.currentDate >= startDate && this.currentDate <= endDate;
  }
}