import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { AuthService } from '../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MarkAttendanceComponent } from '../mark-attendance/mark-attendance.component';
import { LeaveRequestComponent } from '../leave-request/leave-request.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatIconModule,
    RouterModule,
    MatMenuModule
  ]
})
export class NavbarComponent implements OnInit {
  currentUser: any;

  constructor(public dialog: MatDialog, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '400px'
    });
  }

  openRegisterDialog(): void {
    this.dialog.open(RegisterComponent, {
      width: '400px'
    });
  }

  navigateToHome(): void {
    if (this.currentUser) {
      switch (this.currentUser.role) {
        case 'Guest':
          this.router.navigate(['/guest']);
          break;
        case 'Manager':
          this.router.navigate(['/manager']);
          break;
        case 'Receptionist':
          this.router.navigate(['/receptionist']);
          break;
        case 'Housekeeping':
          this.router.navigate(['/housekeeping']);
          break;
        case 'Admin':
          this.router.navigate(['/admin']);
          break;
        default:
          this.router.navigate(['/']);
          break;
      }
    } else {
      this.router.navigate(['/']);
    }
  } 

  openLeaveRequestDialog(): void {
    this.dialog.open(LeaveRequestComponent, {
      width: '400px'
    });
  }

  openMarkAttendanceDialog(): void {
    this.dialog.open(MarkAttendanceComponent, {
      width: '400px'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}