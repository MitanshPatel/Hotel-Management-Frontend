import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    const currentUser = this.getLocalStorageItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(currentUser ? JSON.parse(currentUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/authenticate/login`, { email, password })
      .pipe(map(response => {
        const user = this.decodeToken(response.token);
        this.setLocalStorageItem('currentUser', JSON.stringify(user));
        this.setLocalStorageItem('token', response.token);
        this.currentUserSubject.next(user);
        this.navigateToRole(user.role);
        return user;
      }));
  }

  register(user: any) {
    return this.http.post(`${environment.apiUrl}/authenticate/register`, user);
  }

  logout() {
    this.removeLocalStorageItem('currentUser');
    this.removeLocalStorageItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private decodeToken(token: string) {
    const payload = atob(token.split('.')[1]);
    const parsedPayload = JSON.parse(payload);
    return {
      userId: parsedPayload.nameid,
      role: parsedPayload.role
    };
  }

  private navigateToRole(role: string) {
    switch (role) {
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
  }

  private getLocalStorageItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorageItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}