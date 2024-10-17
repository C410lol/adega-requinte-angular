import { Component, OnInit } from '@angular/core';
import { CartProductComponent } from '../../components/cart-product/cart-product.component';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { CartWineType } from '../../types/CartWineType';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ErrorComponent } from "../../components/error/error.component";
import { UserType } from '../../types/UserType';
import { CartDTO } from '../../dtos/CartDTO';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CartProductComponent, ErrorComponent],
  templateUrl: './cart.component.html',
  styleUrls: [
    './cart.component.css',
    './cart.mobile.component.css',
    './error-styles.css'
  ]
})
export class CartComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  isUserMember: boolean = false;
  isDiscountApplied: boolean = false;

  cartProducts: CartWineType[] = [];

  subTotalPrice: number = 0;
  totalPrice: number = 0;




  constructor(
    private router: Router
  ) { }




  ngOnInit(): void {
    this.getUserInfo();
    this.getCartProducts();
  }




  getUserInfo(): void {
    const userSStorage = sessionStorage.getItem('user');
    if (userSStorage == null) return;

    const user: UserType = JSON.parse(userSStorage);
    this.isUserMember = user.member;
  }




  getCartProducts(): void {
    this.isDiscountApplied = false;
    this.subTotalPrice = 0;
    this.totalPrice = 0;

    const cartProducts = localStorage.getItem('cartProducts');
    if (cartProducts == null || JSON.parse(cartProducts).length < 1) { 
      this.cartProducts = [];
      this.loadStatus = LoadStatus.EMPTY;
      return; 
    }

    this.cartProducts = JSON.parse(cartProducts);

    this.loadStatus = LoadStatus.LOADED;
  }





  getSubtotalPriceRounded(): number {
    return parseFloat(this.subTotalPrice.toFixed(2));
  }

  getTotalPriceRounded(): number {
    return parseFloat(this.totalPrice.toFixed(2));
  }

  setTotalPrice(prices: {total: number, subtotal: number}): void {
    this.subTotalPrice += prices.subtotal;
    this.totalPrice += prices.total;
  }




  goToCheckoutPage(): void {
    if (localStorage.getItem('auth') == null) {
      this.router.navigate(['/login'], {queryParams: {redirectTo: 'checkout'}});
      return;
    }
    this.router.navigate(['/checkout']);
  }

}
