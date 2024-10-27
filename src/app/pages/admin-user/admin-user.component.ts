import { Component, OnInit } from '@angular/core';
import { BackComponent } from "../../components/back/back.component";
import { UserType } from '../../types/UserType';
import { UsersService } from '../../services/users.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { CommonModule } from '@angular/common';
import { OrderComponent } from "../../components/order/order.component";
import { OrderType } from '../../types/OrderType';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [
    BackComponent,
    HttpClientModule,
    CommonModule,
    RouterModule,
    OrderComponent
],
  providers: [UsersService, OrdersService],
  templateUrl: './admin-user.component.html',
  styleUrls: [
    './user-info-styles.css',
    './user-orders-styles.css',
    './admin-user.component.css',
    './admin-user-mobile-styles.css'
  ]
})
export class AdminUserComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;
  ordersLoadStatus: LoadStatus = LoadStatus.LOADING;

  userId: string = '';
  user = {} as UserType;

  userOrders: OrderType[] = [];




  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private ordersService: OrdersService
  ) { }




  ngOnInit(): void {
    this.getUserId();
    this.getUser();
    this.getUserOrders();
  }




  getUserId(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['userId'] != null) this.userId = params['userId'];
  }

  getUser(): void {
    this.usersService.getById(this.userId).subscribe({
      next: (res) => {

        if (res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        this.user = res.body.value;
        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.loadStatus = LoadStatus.ERROR;

      }
    });
  }

  getUserOrders(): void {
    this.ordersService.getAllByUserId(this.userId).subscribe({
      next: (res) => {

        if (res.body == null) {
          this.ordersLoadStatus = LoadStatus.ERROR;
          return;
        }

        if (res.body.value.length < 1) {
          this.ordersLoadStatus = LoadStatus.EMPTY;
          return;
        }

        this.userOrders = res.body.value;
        this.ordersLoadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.ordersLoadStatus = LoadStatus.ERROR;

      }
    })
  }








  isUserMember(): string {
    if (this.user.member) return 'Consorciado';
    return 'Não Consorciado';
  }




  goToUserOrder(orderId: string): void {
    this.router.navigate([`${this.router.url}/orders/${orderId}`]);
  }

}
