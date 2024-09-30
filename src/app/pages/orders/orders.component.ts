import { Component, OnInit } from '@angular/core';
import { OrderComponent } from '../../components/order/order.component';
import { HttpClientModule } from '@angular/common/http';
import { OrdersService } from '../../services/orders.service';
import { Router, RouterModule } from '@angular/router';
import { AuthReturnType } from '../../types/AuthReturnType';
import { OrderType } from '../../types/OrderType';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from "../../components/error/error.component";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, OrderComponent, ErrorComponent],
  providers: [OrdersService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  userId: string = '';

  orders: OrderType[] = [];




  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) { }




  ngOnInit(): void {
    this.getAuth();
    this.getOrders();
  }




  getAuth(): void {
    const authLStorage = localStorage.getItem('auth');
    if (authLStorage == null) {
      this.router.navigate(['/']);
      return;
    }

    const auth: AuthReturnType = JSON.parse(authLStorage);
    this.userId = auth.userId;
  }




  getOrders(): void {
    this.ordersService.getAllByUserId(this.userId).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        if (res.body.value.length < 1) {
          this.loadStatus =LoadStatus.EMPTY;
          return;
        }

        this.orders = res.body.value;
        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.loadStatus = LoadStatus.ERROR;

      }
    });
  }

}
