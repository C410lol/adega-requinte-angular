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
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    OrderProductComponent, 
    BackComponent,
    ErrorComponent
  ],
  providers: [OrdersService],
  templateUrl: './admin-order.component.html',
  styleUrls: [
    '../../styles/btn-styles.css',
    '../../styles/input-styles.css',
    './header-styles.css',
    './admin-order.component.css',
    './mobile-styles.css'
  ]
})
export class AdminOrderComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  orderId: string = '';
  order = {} as OrderType;

  selectedStatus: string = '';
  lastStatus: string = '';




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
        this.selectedStatus = res.body.value.status;
        this.lastStatus = res.body.value.status;

        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.loadStatus = LoadStatus.ERROR;

      }
    });
  }

  editOrderStatus(status: string): void {
    const loadingDialog = this.dialogsService.openLoadingDialog();

    this.ordersService.modifyStatus(this.orderId, status).subscribe({
      next: () => {

        loadingDialog.close();

        this.dialogsService.openDialogSuccess('Pedido editado com sucesso!');
        this.getOrder();

      },
      error: (err) => {

        loadingDialog.close();

        console.error(err);
        this.dialogsService.openDialogError(err.error.message);

      }
    });
  }




  cancelActionDialog(): void {
    this.dialogsService.openActionDialog('Cancelar pedido?').subscribe({
      next: (res) => {

        if (res == 'confirm') this.editOrderStatus('CANCELADO');

      }
    });
  }

  restoreActionDialog(): void {
    this.dialogsService.openActionDialog('Recuperar pedido?').subscribe({
      next: (res) => {

        if (res == 'confirm') this.editOrderStatus('CONFIRMADO');

      }
    });
  }




  isLastStatusDifferent(): boolean {
    if (this.selectedStatus != this.lastStatus) return true;
    return false;
  }

  isUserMember(member: boolean): string {
    return member ? 'Consorciado' : 'Não consorciado';
  }




  getFormatedDate(): string {
    return this.order.date.split('-').reverse().join('/');
  }

  getFormatedEnum(string: string): string {
    return string[0] + string.slice(1).toLowerCase();
  }

}
