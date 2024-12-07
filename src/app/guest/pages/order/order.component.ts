import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order/order.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentService } from '../../../services/payment/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    RouterModule
  ],
  providers: [OrderService]
})
export class OrderComponent implements OnInit {
  foodItems: any[] = [];
  serviceItems: any[] = [];
  selectedCategory: string = 'food';
  reservationId: number;

  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.reservationId = +this.route.snapshot.paramMap.get('reservationId')!;
  }

  ngOnInit(): void {
    this.foodItems = this.orderService.getFoodItems();
    this.serviceItems = this.orderService.getServiceItems();
  }

  pay(item: any, quantity: number): void {
    const totalAmount = item.price * quantity;
    const payment = {
      paymentId: 0,
      reservationId: this.reservationId,
      amount: totalAmount,
      paymentMethod: 'Credit Card',
      paymentFor: `${this.selectedCategory === 'food' ? 'Food' : 'Services'} ${item.name} ${quantity}`,
      paymentDate: new Date().toISOString(),
      status: 'Successful'
    };

    this.paymentService.makePayment(payment).subscribe(
      response => {
        this.snackBar.open(response.msg, 'Close', {
          duration: 3000,
        });
      },
      error => {
        this.snackBar.open('Payment failed. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  showCategory(category: string): void {
    this.selectedCategory = category;
  }
}