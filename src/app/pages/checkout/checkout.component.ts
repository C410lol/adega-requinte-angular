import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartWineType } from '../../types/CartWineType';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CEPInfoType } from '../../types/CEPInfoType';
import { FormsModule } from '@angular/forms';
import { OrderDTO } from '../../dtos/OrderDTO';
import { OrderProductDTO } from '../../dtos/OrderProductDTO';
import { OrdersService } from '../../services/orders.service';
import { CheckoutProductComponent } from '../../components/checkout-product/checkout-product.component';
import { Router, RouterModule } from '@angular/router';
import { AuthReturnType } from '../../types/AuthReturnType';
import { AddressDTO } from '../../dtos/AddressDTO';
import { AddressComponent } from "../../components/address/address.component";
import { AddressType } from '../../types/AddressType';
import { AddressesService } from '../../services/addresses.service';
import { DialogService } from '../../services/dialog.service';
import { AppMessages } from '../../constants/Messages';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, CheckoutProductComponent, AddressComponent],
  providers: [OrdersService, AddressesService, DialogService],
  templateUrl: './checkout.component.html',
  styleUrls: [
    './checkout.component.css',
    './checkout.mobile.component.css',
    './delivery-styles.css',
    './payment-styles.css',
    './resume-styles.css'
  ]
})
export class CheckoutComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  userId: string = '';
  userAddresses: AddressType[] = [];

  selectedDelivery: string = 'PEGAR';
  selectedAddress: string | null = '';

  selectedPayment: string = 'PIX';
  exchange?: string;
  lastExchangeLength: number = 0;

  cartProducts: CartWineType[] = [];
  subtotalPrice: number = 0;
  totalPrice: number = 0;

  // --------------------------------------------- //

  name: string = '';
  cep: string = '';
  street: string = '';
  number: string = '';
  complement: string = '';
  referencePoint: string = '';
  neighborhood: string = '';

  city: string = '';
  state: string = '';
  isDisabled: boolean = false;




  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private ordersService: OrdersService,
    private addressesService: AddressesService,
    private dialogService: DialogService
  ) { }




  ngOnInit(): void {
    this.getAuth();
    this.getAddresses();
    this.getCartProducts();   
  }




  getAuth(): void {
    const authLStorage = localStorage.getItem('auth');
    if (authLStorage == null) {
      this.router.navigate(['/login'], {queryParams: {redirectTo: 'checkout'}});
      return;
    }

    const auth: AuthReturnType = JSON.parse(authLStorage);
    this.userId = auth.userId;
  }




  getAddresses(): void {
    this.addressesService.getByUserId(this.userId).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) return;

        this.userAddresses = res.body.value;

      },
      error: (err) => {
      
        console.error(err);
      
      }
    })
  }

  getCartProducts(): void {
    const cartProducts = localStorage.getItem('cartProducts');
    if (cartProducts == null || JSON.parse(cartProducts).length < 1) {
      this.loadStatus = LoadStatus.EMPTY;
      return; 
    }

    this.cartProducts = JSON.parse(cartProducts);
    this.setTotalPrice();

    this.loadStatus = LoadStatus.LOADED;
  }

  addDeliveryTax(): void {
    this.totalPrice += 5;
  }

  removeDeliveryTax(): void {
    this.totalPrice = this.subtotalPrice;
  }

  getPriceRounded(price: number): number {
    return parseFloat(price.toFixed(2));
  }

  setTotalPrice(): void {
    this.cartProducts.forEach((e) => this.subtotalPrice += e.totalPrice);
    this.totalPrice = this.subtotalPrice;
  }




  getCepInformations(): void {
    if (this.cep.trim().replace('-', '').length != 8) {
      this.isDisabled = false;
      return;
    }

    this.httpClient.get<CEPInfoType>(`https://viacep.com.br/ws/${this.cep}/json/`).subscribe({
      next: (res) => {
        this.cep = res.cep;
        this.city = res.localidade;
        this.state = res.estado;

        this.isDisabled = true;
      }
    });
  }




  finalizeShop(): void {
    let order: OrderDTO = {
      delivery: this.selectedDelivery,
      payment: this.selectedPayment,
      orderProducts: []
    };


    //SET OrderProducts
    let orderProducts: OrderProductDTO[] = [];
    this.cartProducts.forEach((e) => orderProducts.push({
      productId: e.wine.id, 
      totalPrice: e.totalPrice, 
      quantity: e.quantity
    }));
    order.orderProducts = orderProducts;
    //SET OrderProducts


    //SET Delivery AND Address
    if (this.selectedDelivery == 'ENTREGAR') {
      if (this.selectedAddress == '') {
        this.dialogService.openDialogError('Selecione um endereço!');
        return;
      }

      if (this.selectedAddress == null) {
        if (!this.isFieldsOk()) {
          this.dialogService.openDialogError(AppMessages.fieldError);
          return;
        }

        order.address = this.setAddress();
      }
    }
    if (this.selectedDelivery == 'PEGAR') this.selectedAddress = '';
    //SET Delivery AND Address


    //SET Payment AND Exchange
    if (this.selectedPayment == 'DINHEIRO') {
      if (
        this.exchange == null || 
        this.exchange.length < 1 ||
        parseFloat(this.exchange) < this.totalPrice
      ) {
        this.dialogService.openDialogError('Selecione um troco válido!');
        return;
      }

      order.exchange = parseFloat(this.exchange);
    }
    //SET Payment AND Exchange


    this.ordersService.save(this.userId, order, this.selectedAddress).subscribe({
      next: (res) => {

        localStorage.removeItem('cartProducts');
        this.router.navigate(['/confirmed-order'], {queryParams: {orderId: res.body?.value.id}});

      },
      error: (err) => {

        console.log(err);

      }
    });
  }




  isFieldsOk(): boolean {
    if (
      this.name.trim().length < 1 ||
      this.cep.trim().length < 1 ||
      this.street.trim().length < 1 ||
      this.number.trim().length < 1 ||
      this.neighborhood.trim().length < 1 ||
      this.city.trim().length < 1 ||
      this.state.trim().length < 1
    ) return false;
    return true;
  }

  setAddress(): AddressDTO {
    return {
      name: this.name,
      cep: this.cep,
      street: this.street,
      number: this.number,
      complement: this.complement,
      referencePoint: this.referencePoint,
      neighborhood: this.neighborhood,
      city: this.city,
      state: this.state
    }
  }

  exhcnageInputCheck(): void {
    if (this.exchange != null) {
      const noPoint = this.exchange.replace(/\D/g, '');

      if (noPoint.length == 0) this.exchange = '';

      if (noPoint.length <= 2 && noPoint.length > 0) this.exchange = '.' + noPoint;

      if (noPoint.length > 2) {
        const x = noPoint.slice(noPoint.length - 2);
        const y = noPoint.slice(0, noPoint.length - 2) + '.';

        this.exchange = y + x;
      }
    }
  }




  changeDelivery(d: string): void {
    this.selectedDelivery = d;
  }

  changePayment(p: string): void {
    this.selectedPayment = p;
  }

}
