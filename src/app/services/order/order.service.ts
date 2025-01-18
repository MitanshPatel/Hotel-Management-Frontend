import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private foodItems = [
    { id: 1, name: 'Breakfast Thali Veg', price: 150, image: '../../../assets/imgs/breakfast-veg.jpg' },
    { id: 2, name: 'Breakfast Thali Non-Veg', price: 200, image: '../../../assets/imgs/breakfast-nonveg.jpg' },
    { id: 3, name: 'Lunch Thali Veg', price: 250, image: '../../../assets/imgs/lunch-veg.jpg' },
    { id: 4, name: 'Lunch Thali Non-Veg', price: 300, image: '../../../assets/imgs/lunch-nonveg.jpg' },
    { id: 5, name: 'Dinner Thali Veg', price: 300, image: '../../../assets/imgs/dinner-veg.jpg' },
    { id: 6, name: 'Dinner Thali Non-Veg', price: 350, image: '../../../assets/imgs/dinner-nonveg.jpg' }
  ];

  private serviceItems = [
    { id: 1, name: 'Spa', price: 500, image: '../../../assets/imgs/spa.jpg' },
    { id: 2, name: 'Gym', price: 300, image: '../../../assets/imgs/gym.jpeg' },
    { id: 3, name: 'Swimming Pool', price: 200, image: '../../../assets/imgs/pool.jpg' },
    { id: 4, name: 'Laundry', price: 150, image: '../../../assets/imgs/laundry.jpg' },
    { id: 5, name: 'Room Cleaning', price: 100, image: '../../../assets/imgs/cleaning.jpeg' }
  ];

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': '*/*'
    });
  }

  getFoodItems() {
    return this.foodItems;
  }

  getServiceItems() {
    return this.serviceItems;
  }

  getFoodOrders(pageNumber: number = 1, pageSize: number = 5): Observable<PaginatedResponse<any>> {
    const params = new HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    return this.http.get<PaginatedResponse<any>>('http://localhost:5065/api/service/my-food', { headers: this.getAuthHeaders(), params });
  }
  
  getServiceOrders(pageNumber: number = 1, pageSize: number = 5): Observable<PaginatedResponse<any>> {
    const params = new HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    return this.http.get<PaginatedResponse<any>>('http://localhost:5065/api/service/my-services', { headers: this.getAuthHeaders(), params });
  }

}

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
}