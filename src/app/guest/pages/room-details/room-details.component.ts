import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationService } from '../../../services/reservation/reservation.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaterialTimepickerModule,
    FormsModule,
    MatSelectModule
  ],
  providers: [DatePipe]
})
export class RoomDetailsComponent implements OnInit {
  room: any;
  checkInDate: string = '';
  checkOutDate: string = '';
  checkInTime: string = '';
  checkOutTime: string = '';
  numberOfNights: number = 0;
  totalPrice: number = 0;
  reviews: any[] = [];
  averageRating: number = 0;
  rating: number = 0;
  comments: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('roomId')!;
    const checkInDateRaw = this.route.snapshot.queryParamMap.get('checkInDate') || '';
    const checkOutDateRaw = this.route.snapshot.queryParamMap.get('checkOutDate') || '';
    this.numberOfNights = +(this.route.snapshot.queryParamMap.get('numberOfNights')!) || 0;

    this.checkInDate = this.datePipe.transform(checkInDateRaw, 'yyyy-MM-dd') || '';
    this.checkOutDate = this.datePipe.transform(checkOutDateRaw, 'yyyy-MM-dd') || '';

    this.reservationService.getRoomDetails(roomId).subscribe(data => {
      this.room = data;
      this.totalPrice = this.room.price * this.numberOfNights;
    });
    this.fetchRoomReviews(roomId);
  }

  fetchRoomReviews(roomId: string): void {
    this.reservationService.getRoomReviews(roomId).subscribe(response => {
      this.reviews = response.reviews;
      this.averageRating = response.averageRating;
    });
  }

  addReview(): void {
    const review = {
      reviewId: 0,
      guestId: this.authService.currentUserValue.userId,
      reservationId: null,
      roomId: this.room.roomId,
      rating: this.rating,
      comments: this.comments,
      reviewDate: new Date().toISOString()
    };

    this.reservationService.addReview(review).subscribe({
      next: () => {
        this.snackBar.open('Review added successfully.', 'Close', {
          duration: 3000,
        });
        this.fetchRoomReviews(this.room.roomId);
        this.rating = 0;
        this.comments = '';
      },
      error: () => {
        this.snackBar.open('Failed to add review. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  checkAvailability(): void {
    const checkInDateTime = `${this.checkInDate}T${this.formatTime(this.checkInTime)}`;
    const checkOutDateTime = `${this.checkOutDate}T${this.formatTime(this.checkOutTime)}`;
    const currentDateTime = new Date();
  
    if (new Date(checkOutDateTime) <= new Date(checkInDateTime)) {
      this.snackBar.open('Check-out date and time must be after check-in date and time.', 'Close', {
        duration: 3000,
      });
      return;
    }
  
    if (new Date(checkInDateTime) <= currentDateTime) {
      this.snackBar.open('Check-in date and time must be after the current date and time.', 'Close', {
        duration: 3000,
      });
      return;
    }
  
    this.reservationService.checkRoomAvailability(this.room.roomId, checkInDateTime, checkOutDateTime).subscribe(response => {
      if (response.isAvailable) {
        this.snackBar.open('The room is available for the selected time.', 'Close', {
          duration: 3000,
        });
      } else {
        let message = 'The room is not available for the selected time.';
        if (response.nextAvailableCheckIn) {
          message += ` Next available check-in: ${this.datePipe.transform(response.nextAvailableCheckIn, 'dd-MM-yyyy HH:mm')}`;
        }
        if (response.nextAvailableCheckOut) {
          message += ` Next available check-out: ${this.datePipe.transform(response.nextAvailableCheckOut, 'dd-MM-yyyy HH:mm')}`;
        }
        this.snackBar.open(message, 'Close', {
          duration: 5000,
        });
      }
    });
  }
  
  reserveRoom(): void {
    const checkInDateTime = `${this.checkInDate}T${this.formatTime(this.checkInTime)}`;
    const checkOutDateTime = `${this.checkOutDate}T${this.formatTime(this.checkOutTime)}`;
    const currentDateTime = new Date();
  
    if (new Date(checkOutDateTime) <= new Date(checkInDateTime)) {
      this.snackBar.open('Check-out date and time must be after check-in date and time.', 'Close', {
        duration: 3000,
      });
      return;
    }
  
    if (new Date(checkInDateTime) <= currentDateTime) {
      this.snackBar.open('Check-in date and time must be after the current date and time.', 'Close', {
        duration: 3000,
      });
      return;
    }
  
    this.reservationService.checkRoomAvailability(this.room.roomId, checkInDateTime, checkOutDateTime).subscribe(response => {
      if (response.isAvailable) {
        const guestId = this.authService.currentUserValue.userId;
        const checkInDate = new Date(checkInDateTime);
        const checkOutDate = new Date(checkOutDateTime);
        const numberOfNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
        const totalAmount = this.room.price * numberOfNights;
        const reservation = {
          reservationId: 0,
          guestId: guestId,
          roomId: this.room.roomId,
          checkInDate: checkInDateTime,
          checkOutDate: checkOutDateTime,
          status: 'Pending',
          paymentStatus: 'Pending',
          specialRequests: '',
          totalAmount: totalAmount
        };
  
        this.reservationService.createReservation(reservation).subscribe({
          next: () => {
            this.snackBar.open('Reservation successful. Please wait for hotel approval.', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/guest/reservation-history']);
          },
          error: () => {
            this.snackBar.open('Reservation failed. Please try again.', 'Close', {
              duration: 3000,
            });
          }
        });
      } else {
        let message = 'The room is not available for the selected time.';
        if (response.nextAvailableCheckIn) {
          message += ` Next available check-in: ${this.datePipe.transform(response.nextAvailableCheckIn, 'dd-MM-yyyy HH:mm')}`;
        }
        if (response.nextAvailableCheckOut) {
          message += ` Next available check-out: ${this.datePipe.transform(response.nextAvailableCheckOut, 'dd-MM-yyyy HH:mm')}`;
        }
        this.snackBar.open(message, 'Close', {
          duration: 5000,
        });
      }
    });
  }

  private formatTime(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }

    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  }
}