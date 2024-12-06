import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/room/room.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoomDialogComponent } from '../room-dialog/room-dialog.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class RoomListComponent implements OnInit {
  rooms: any[] = [];
  filter = {
    bedType: '',
    view: '',
    status: '',
    roomType: ''
  };

  constructor(private roomService: RoomService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe(data => {
      this.rooms = data;
    });
  }

  deleteRoom(roomId: number): void {
    this.roomService.deleteRoom(roomId).subscribe(() => {
      this.loadRooms();
    });
  }

  applyFilter(): void {
    // Implement filter logic here
  }

  openAddRoomDialog(): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRooms();
      }
    });
  }

  openEditRoomDialog(room: any): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '400px',
      data: { room }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRooms();
      }
    });
  }
}