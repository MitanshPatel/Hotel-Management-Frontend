import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { RoomService } from '../../../services/room/room.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-dialog',
  standalone: true,
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule
  ]
})

export class RoomDialogComponent {
  room: any = {
    roomId: 0,
    roomType: '',
    price: 0,
    status: '',
    bedType: '',
    view: '',
    availability: true
  };
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roomService: RoomService
  ) {
    if (data && data.room) {
      this.room = { ...data.room };
      this.isEditMode = true;
    }
  }

  saveRoom(): void {
    if (this.isEditMode) {
      this.roomService.updateRoom(this.room.roomId, this.room).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.roomService.addRoom(this.room).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}