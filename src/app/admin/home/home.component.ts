import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { AttendanceService } from '../../services/attendance/attendance.service';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

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
    MatSnackBarModule,
    NgxChartsModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class AdminHomeComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  shiftType: string = '';
  showForm: boolean = true;
  monthlyRevenue: any[] = [];
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Revenue';
  colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private attendanceService: AttendanceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchAnalytics();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    });
  }

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

      const shift = {
        staffId: user.userId,
        shiftType: this.shiftType
      };

      await lastValueFrom(this.attendanceService.addShift(shift));
      this.snackBar.open('Shift added successfully', 'Close', {
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

  toggleView() {
    this.showForm = !this.showForm;
  }

  fetchAnalytics() {
    this.http.get<any[]>(`${this.apiUrl}/analytics/monthly-revenue`, { headers: this.getAuthHeaders() }).subscribe(data => {
      this.monthlyRevenue = data.map(item => ({
        name: item.month,
        value: item.revenue
      }));
    }, error => {
      console.error('Error fetching analytics data:', error);
    });
  }
}