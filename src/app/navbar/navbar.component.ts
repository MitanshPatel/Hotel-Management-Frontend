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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}