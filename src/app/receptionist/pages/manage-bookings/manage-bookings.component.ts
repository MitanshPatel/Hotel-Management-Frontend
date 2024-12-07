import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ReservationService } from '../../../services/reservation/reservation.service';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-bookings',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, HttpClientModule,
    MatFormFieldModule, MatOptionModule, MatSelectModule, FormsModule
  ],
  providers: [ReservationService, DatePipe],
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css']
})
export class ManageBookingsComponent implements OnInit {
  bookings: any[] = [];
  selectedStatus: string = 'all';

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.getAllBookings();
  }

  getAllBookings(): void {
    this.reservationService.getAllBookings().subscribe(data => {
      this.bookings = this.sortBookingsByCheckInDate(data);
    });
  }

  getPendingBookings(): void {
    this.reservationService.getPendingBookings().subscribe(data => {
      this.bookings = this.sortBookingsByCheckInDate(data);
    });
  }

  getApprovedBookings(): void {
    this.reservationService.getApprovedBookings().subscribe(data => {
      this.bookings = this.sortBookingsByCheckInDate(data);
    });
  }

  getRejectedBookings(): void {
    this.reservationService.getRejectedBookings().subscribe(data => {
      this.bookings = data;
    });
  }

  filterBookings(): void {
    switch (this.selectedStatus) {
      case 'pending':
        this.getPendingBookings();
        break;
      case 'approved':
        this.getApprovedBookings();
        break;
      case 'rejected':
        this.getRejectedBookings();
        break;
      default:
        this.getAllBookings();
        break;
    }
  }

  updateBookingStatus(reservationId: number, status: string): void {
    this.reservationService.updateBookingStatus(reservationId, status).subscribe(() => {
      this.filterBookings();
    });
  }

  sortBookingsByCheckInDate(bookings: any[]): any[] {
    return bookings.sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());
  }
}