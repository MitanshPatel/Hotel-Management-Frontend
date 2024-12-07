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
import { Router, RouterModule } from '@angular/router';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
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
    RouterModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  role: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<RegisterComponent>,
    private snackBar: MatSnackBar
  ) {}

  async onSubmit() {
    const user = {
      userId: 0,
      username: this.username,
      passwordHash: this.password,
      role: this.role,
      email: this.email,
      isActive: true
    };

    try {
      const data = await lastValueFrom(this.authService.register(user));
      this.dialogRef.close();
      this.snackBar.open('Registered Successfully', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/login']);

    } catch (error) {
      console.error('Registration failed', error);
      this.snackBar.open('Registration failed: Please check your details', 'Close', {
        duration: 3000,
      });
    }
  }
}