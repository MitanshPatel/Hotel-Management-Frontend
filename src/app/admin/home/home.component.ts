import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class AdminHomeComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  role: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async onSubmit() {
    const user = {
      userId: Math.floor(100000 + Math.random() * 900000),
      username: this.username,
      passwordHash: this.password,
      role: this.role,
      email: this.email,
      isActive: true
    };

    try {
      const data = await lastValueFrom(this.authService.adminRegister(user));
      this.snackBar.open('User added successfully', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Adding user failed', error);
      const errorMessage = (error as any).error?.msg || 'Adding user failed: Please check your details';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 3000,
      });
    }
  }
}