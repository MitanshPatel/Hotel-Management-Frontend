import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HousekeepingOrdersService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getFoodOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service/food`, { headers: this.getAuthHeaders() });
  }

  getServiceOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service/services`, { headers: this.getAuthHeaders() });
  }

  updateOrderStatusToUnderProcess(serviceId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/service/${serviceId}/under-process`, {}, { headers: this.getAuthHeaders() });
  }

  updateOrderStatusToComplete(serviceId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/service/${serviceId}/complete`, {}, { headers: this.getAuthHeaders() });
  }
}