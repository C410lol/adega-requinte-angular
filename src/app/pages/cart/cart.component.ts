import { Component, OnInit } from '@angular/core';
import { CartProductComponent } from '../../components/cart-product/cart-product.component';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { CartWineType } from '../../types/CartWineType';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ErrorComponent } from "../../components/error/error.component";

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

  cartProducts: CartWineType[] = [];

  totalPrice: number = 0;




  constructor(
    private router: Router
  ) { }




  ngOnInit(): void {
    this.getCartProducts();
  }




  getCartProducts(): void {
    const cartProducts = localStorage.getItem('cartProducts');
    if (cartProducts == null || JSON.parse(cartProducts).length < 1) { 
      this.cartProducts = [];
      this.setTotalPrice();
      this.loadStatus = LoadStatus.EMPTY;
      return; 
    }

    this.cartProducts = JSON.parse(cartProducts);
    this.setTotalPrice();

    this.loadStatus = LoadStatus.LOADED;
  }




  getTotalPriceRounded(): number {
    return parseFloat(this.totalPrice.toFixed(2));
  }

  setTotalPrice(): void {
    this.totalPrice = 0;
    this.cartProducts.forEach((e) => this.totalPrice += e.totalPrice);
  }

  updateTotalPrice(change: number): void {
    this.totalPrice += change;
  }




  goToCheckoutPage(): void {
    if (localStorage.getItem('auth') == null) {
      this.router.navigate(['/login'], {queryParams: {redirectTo: 'checkout'}});
      return;
    }
    this.router.navigate(['/checkout']);
  }

}
