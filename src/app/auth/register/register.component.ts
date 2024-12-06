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
    MatDialogModule
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
    public dialogRef: MatDialogRef<RegisterComponent>
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
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Registration failed', error);
    }
  }
}