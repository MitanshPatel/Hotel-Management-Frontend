import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../../../services/order/order.service';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-history',
  standalone: true,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  providers: [OrderService]
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  selectedCategory: string = 'food';

  constructor(
    private snackBar: MatSnackBar,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const orderObservable = this.selectedCategory === 'food' ? this.orderService.getFoodOrders() : this.orderService.getServiceOrders();
    orderObservable.subscribe({
      next: data => {
        this.orders = data.sort((a, b) => b.serviceId - a.serviceId);
      },
      error: () => {
        this.snackBar.open('Failed to load orders. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  showCategory(category: string): void {
    this.selectedCategory = category;
    this.loadOrders();
  }
}