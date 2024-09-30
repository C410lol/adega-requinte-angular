import { Component, OnInit } from '@angular/core';
import { OrderType } from '../../types/OrderType';
import { CommonModule } from '@angular/common';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { BackComponent } from '../../components/back/back.component';
import { OrderProductComponent } from '../../components/order-product/order-product.component';
import { DialogService } from '../../services/dialog.service';
import { OrdersService } from '../../services/orders.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [CommonModule, HttpClientModule, OrderProductComponent, BackComponent],
  providers: [OrdersService],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.css'
})
export class AdminOrderComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  orderId: string = '';
  order = {} as OrderType;




  constructor(
    private activatedRoute: ActivatedRoute,
    private ordersService: OrdersService,
    private dialogsService: DialogService
  ) { }




  ngOnInit(): void {
    this.getOrderId();
  }




  getOrderId(): void {
    this.activatedRoute.params.subscribe({
      next: (res) => {

        this.orderId = res['orderId'];
        this.getOrder();

      },
      error: (err) => {

        console.error(err);
        this.loadStatus = LoadStatus.ERROR;

      }
    })
  }




  getOrder(): void {
    this.ordersService.getById(this.orderId).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        this.order = res.body.value;
        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.loadStatus = LoadStatus.ERROR;

      }
    })
  }




  cancelActionDialog(): void {
    this.dialogsService.openActionDialog('Cancelar pedido?').subscribe({
      next: (res) => {

      }
    })
  }




  getFormatedDate(): string {
    return this.order.date.split('-').reverse().join('/');
  }

  getFormatedEnum(string: string): string {
    return string[0] + string.slice(1).toLowerCase();
  }

}
