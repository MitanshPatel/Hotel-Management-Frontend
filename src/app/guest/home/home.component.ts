import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from '../../services/reservation/reservation.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
  range: FormGroup;
  numberOfNights: number = 0;
  filter = {
    bedType: '',
    view: '',
    status: '',
    roomType: ''
  };

  constructor(
    private reservationService: ReservationService,
    private datePipe: DatePipe,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.range = this.fb.group({
      start: [null],
      end: [null]
    });
  }

  ngOnInit(): void {}

  searchAvailableRooms(): void {
    const { start, end } = this.range.value;
    const formattedCheckInDate = start ? this.datePipe.transform(start, 'yyyy-MM-ddTHH:mm:ss') : '';
    const formattedCheckOutDate = end ? this.datePipe.transform(end, 'yyyy-MM-ddTHH:mm:ss') : '';

    if (formattedCheckInDate && formattedCheckOutDate) {
      const checkIn = new Date(start);
      const checkOut = new Date(end);
      this.numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24));
    }

    this.reservationService.getAvailableRooms(formattedCheckInDate || '', formattedCheckOutDate || '').subscribe(data => {
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
    const { start, end } = this.range.value;
    const url = this.router.serializeUrl(this.router.createUrlTree(['/guest/rooms', roomId], {
      queryParams: {
        checkInDate: start,
        checkOutDate: end,
        numberOfNights: this.numberOfNights
      }
    }));
    window.open(url, '_blank');
  }
}