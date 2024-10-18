import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartWineType } from '../../types/CartWineType';
import { HttpClientModule } from '@angular/common/http';
import { WinesService } from '../../services/wines.service';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { CommonModule } from '@angular/common';
import { formatPriceNumber } from '../../constants/Utils';

@Component({
  selector: 'app-cart-product',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [WinesService],
  templateUrl: './cart-product.component.html',
  styleUrl: './cart-product.component.css'
})
export class CartProductComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  @Input() cartProduct = {} as CartWineType;

  @Input() isUserMember: boolean = false;

  memberPrice: number = 0;

  @Output() setTotalPriceEvent: EventEmitter<{total: number, subtotal: number}> = new EventEmitter<{total: number, subtotal: number}>();
  @Output() discountAppliedEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteProductEvent: EventEmitter<void> = new EventEmitter<void>();




  constructor(
    private winesService: WinesService
  ) { }



  ngOnInit(): void {
    this.winesService.getWineById(this.cartProduct.wine.id).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        if (res.body.status == 'INDISPONÍVEL' || res.body.quantity < 1) {
          this.deleteCartProduct();
          return;
        }

        this.cartProduct.wine = res.body;

        if (this.isUserMember && !this.cartProduct.wine.hasProm) {
          this.discountAppliedEvent.emit();
          this.memberPrice = (this.cartProduct.wine.currentPrice * 90) / 100;
        } else this.memberPrice = this.cartProduct.wine.currentPrice;
        
        const totalPrice = this.memberPrice * this.cartProduct.quantity;
        this.cartProduct.subtotalPrice = this.cartProduct.quantity * res.body.currentPrice;
        this.setTotalPriceEvent.emit({total: totalPrice, subtotal: this.cartProduct.subtotalPrice});

        this.loadStatus = LoadStatus.LOADED;

        this.updateCartProduct(this.cartProduct);

      }
    });
  }




  findCartProduct(): { index: number, cartProducts: CartWineType[] } | null {
    const cartProductsLocalStorage = localStorage.getItem('cartProducts');
    if (cartProductsLocalStorage == null) return null;

    let cartProducts: CartWineType[] = JSON.parse(cartProductsLocalStorage);
    let carProductLocalStorage = cartProducts.find((e) => e.wine?.id == this.cartProduct?.wine?.id);
    if(carProductLocalStorage == null) return null;

    const cartProductIndex = cartProducts.indexOf(carProductLocalStorage);
    
    return { index: cartProductIndex, cartProducts: cartProducts };
  }

  updateCartProduct(cartProduct: CartWineType): void {
    let findCartProduct = this.findCartProduct();
    if (findCartProduct == null) return;

    findCartProduct.cartProducts[findCartProduct.index] = cartProduct;
    localStorage.setItem('cartProducts', JSON.stringify(findCartProduct.cartProducts));
  }

  deleteCartProduct(): void {
    let findCartProduct = this.findCartProduct();
    if (findCartProduct == null) return;

    findCartProduct.cartProducts.splice(findCartProduct.index, 1);
    localStorage.setItem('cartProducts', JSON.stringify(findCartProduct.cartProducts));

    this.deleteProductEvent.emit();
  }




  changeQuantity(operation: string): void {
    const lastSubtotalPrice = this.cartProduct.subtotalPrice;
    const lastTotalPrice = this.memberPrice * this.cartProduct.quantity;
    
    if (operation == 'plus' && this.cartProduct.quantity + 1 <= this.cartProduct.wine.quantity) this.cartProduct.quantity++;
    if (operation == 'minus' && this.cartProduct.quantity - 1 > 0) this.cartProduct.quantity--;

    const totalPrice = parseFloat((this.cartProduct.quantity * this.memberPrice).toFixed(2));
    this.cartProduct.subtotalPrice = parseFloat((this.cartProduct.quantity * this.cartProduct.wine.currentPrice).toFixed(2)); 
    this.updateCartProduct(this.cartProduct);
    this.setTotalPriceEvent.emit({total: totalPrice - lastTotalPrice, subtotal: this.cartProduct.subtotalPrice - lastSubtotalPrice});
  }




  getFirstImage(): string {
    if (this.cartProduct.wine.images == null || this.cartProduct.wine.images.length < 1) return '../../assets/wine_img.png';
    return this.cartProduct.wine.images[0];
  }

  getRoudendPrice(): number {
    return parseFloat(this.cartProduct.subtotalPrice.toFixed(2));
  }

  formatPriceNumber(number?: number): string {
    return formatPriceNumber(number);
  }

}
