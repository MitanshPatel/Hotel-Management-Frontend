import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from '../../services/reservation/reservation.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [DatePipe]
})
export class GuestHomeComponent implements OnInit {
  availableRooms: any[] = [];
  filteredRooms: any[] = [];
  checkInDate: string = '';
  checkOutDate: string = '';
  numberOfNights: number = 0;
  filter = {
    bedType: '',
    view: '',
    status: '',
    roomType: ''
  };

  constructor(private reservationService: ReservationService, private datePipe: DatePipe, private router: Router) {}

  ngOnInit(): void {}

  searchAvailableRooms(): void {
    const formattedCheckInDate = this.datePipe.transform(this.checkInDate, 'yyyy-MM-ddTHH:mm:ss') || '';
    const formattedCheckOutDate = this.datePipe.transform(this.checkOutDate, 'yyyy-MM-ddTHH:mm:ss') || '';

    if (formattedCheckInDate!='' || formattedCheckOutDate !='') {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);
      this.numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
    }

    this.reservationService.getAvailableRooms(formattedCheckInDate, formattedCheckOutDate).subscribe(data => {
      this.availableRooms = data;
      this.filteredRooms = this.availableRooms;
    });
  }

  applyFilter(): void {
    this.filteredRooms = this.availableRooms.filter(room => {
      return (
        (this.filter.bedType === '' || room.bedType === this.filter.bedType) &&
        (this.filter.view === '' || room.view === this.filter.view) &&
        (this.filter.status === '' || room.status === this.filter.status) &&
        (this.filter.roomType === '' || room.roomType === this.filter.roomType)
      );
    });
  }

  viewRoomDetails(roomId: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/guest/rooms', roomId], {
      queryParams: {
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        numberOfNights: this.numberOfNights
      }
    }));
    window.open(url, '_blank');
  }
}