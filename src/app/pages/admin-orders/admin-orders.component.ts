import { Component, OnInit } from '@angular/core';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { OrderType } from '../../types/OrderType';
import { OrdersService } from '../../services/orders.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdminOrderComponent } from "../../components/admin-order/admin-order.component";

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AdminOrderComponent],
  providers: [OrdersService],
  templateUrl: './admin-orders.component.html',
  styleUrls: [
    '../../styles/product-styles.css',
    './admin-orders.component.css'
  ]
})
export class AdminOrdersComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  orders: OrderType[] = [];




  constructor(
    private ordersService: OrdersService
  ) { }




  ngOnInit(): void {
    this.getOrders();
  }




  getOrders(): void {
    this.ordersService.getAll().subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        if (res.body.value.empty) {
          this.loadStatus = LoadStatus.EMPTY;
          return;
        }

        this.orders = res.body.value.content;
        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.loadStatus = LoadStatus.ERROR;

      }
    })
  }

}
