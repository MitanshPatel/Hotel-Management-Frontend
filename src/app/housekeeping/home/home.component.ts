import { Component, OnInit } from '@angular/core';
import { HousekeepingOrdersService } from '../../services/housekeeping-orders/housekeeping-orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Observable } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-housekeeping-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HousekeepingHomeComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedCategory: string = 'all';
  selectedStatus: string = 'all';

  constructor(private ordersService: HousekeepingOrdersService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getFoodOrders().subscribe({
      next: foodOrders => {
        this.ordersService.getServiceOrders().subscribe({
          next: serviceOrders => {
            this.orders = [...foodOrders, ...serviceOrders];
            this.filterOrders();
          },
          error: () => {
            this.snackBar.open('Failed to load service orders. Please try again.', 'Close', {
              duration: 3000,
            });
          }
        });
      },
      error: () => {
        this.snackBar.open('Failed to load food orders. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders
      .filter(order => {
        const categoryMatch = this.selectedCategory === 'all' || order.serviceType.toLowerCase().includes(this.selectedCategory);
        const statusMatch = this.selectedStatus === 'all' || order.status === this.selectedStatus;
        return categoryMatch && statusMatch;
      })
      .sort((a, b) => new Date(b.requestTime).getTime() - new Date(a.requestTime).getTime());
      
  }

  updateOrderStatus(order: any, status: string): void {
    let updateObservable: Observable<any>;

    if (status === 'Under Process') {
      updateObservable = this.ordersService.updateOrderStatusToUnderProcess(order.serviceId);
    } else if (status === 'Completed') {
      updateObservable = this.ordersService.updateOrderStatusToComplete(order.serviceId);
    } else {
      return;
    }

    updateObservable.subscribe({
      next: () => {
        order.status = status;
        if (status === 'Completed') {
          order.deliveryTime = new Date().toISOString();
        }
        this.snackBar.open(`Order #${order.serviceId} status updated to ${status}.`, 'Close', {
          duration: 3000,
        });
        this.loadOrders();
      },
      error: () => {
        this.snackBar.open('Failed to update order status. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  showCategory(category: string): void {
    this.selectedCategory = category;
    this.filterOrders();
  }

  showStatus(status: string): void {
    this.selectedStatus = status;
    this.filterOrders();
  }
}
