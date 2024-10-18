import { Component, OnInit } from '@angular/core';
import { OrderType } from '../../types/OrderType';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { OrdersService } from '../../services/orders.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderProductComponent } from '../../components/order-product/order-product.component';
import { BackComponent } from "../../components/back/back.component";
import { DialogService } from '../../services/dialog.service';
import { ErrorComponent } from '../../components/error/error.component';
import { formatPriceNumber } from '../../constants/Utils';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    OrderProductComponent, 
    BackComponent,
    ErrorComponent
  ],
  providers: [OrdersService],
  templateUrl: './order.component.html',
  styleUrls: [
    './order.component.css',
    './order.mobile.component.css'
  ]
})
export class OrderComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  orderId: string = '';
  order = {} as OrderType;




  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private dialogService: DialogService
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

  cancelOrder(): void {
    const loadingDialog = this.dialogService.openLoadingDialog();

    this.ordersService.cancelOrder(this.orderId).subscribe({
      next: () => {
        
        loadingDialog.close();

        this.dialogService.openDialogSuccess('Pedido cancelado com sucesso!');
        this.router.navigate(['/orders']);

      },
      error: (err) => {

        loadingDialog.close();

        console.error(err);
        this.dialogService.openDialogSuccess(err.error.message);

      }
    });
  }




  cancelActionDialog(): void {
    this.dialogService.openActionDialog('Cancelar pedido?').subscribe({
      next: (res) => {

        if (res == 'confirm') this.cancelOrder();

      }
    })
  }




  getFormatedDate(): string {
    return this.order.date.split('-').reverse().join('/');
  }

  getFormatedEnum(string: string): string {
    return string[0] + string.slice(1).toLowerCase();
  }

  formatPriceNumber(number?: number): string {
    return formatPriceNumber(number);
  }

}
