import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../../../services/order/order.service';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-order-history',
  standalone: true,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatPaginatorModule
  ],
  providers: [OrderService]
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  selectedCategory: string = 'food';
  pageNumber: number = 1;
  pageSize: number = 5;
  totalOrders: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const orderObservable = this.selectedCategory === 'food' ? 
      this.orderService.getFoodOrders(this.pageNumber, this.pageSize) : 
      this.orderService.getServiceOrders(this.pageNumber, this.pageSize);
    orderObservable.subscribe({
      next: data => {
        this.orders = data.items;
        this.totalOrders = data.totalCount;
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

  onPageChange(event: any): void {
    
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    console.log(this.pageNumber, this.pageSize);
    this.loadOrders();
  }
}