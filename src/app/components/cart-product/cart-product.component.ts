import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartWineType } from '../../types/CartWineType';
import { HttpClientModule } from '@angular/common/http';
import { WinesService } from '../../services/wines.service';
import { LoadStatus } from '../../constants/LoadStatusEnum';

@Component({
  selector: 'app-cart-product',
  standalone: true,
  imports: [HttpClientModule],
  providers: [WinesService],
  templateUrl: './cart-product.component.html',
  styleUrl: './cart-product.component.css'
})
export class CartProductComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  @Input() cartProduct = {} as CartWineType;

  @Output() totalPriceChangeEvent: EventEmitter<number> = new EventEmitter<number>();
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

        if (res.body.status == 'INDISPONÍVEL') {
          this.deleteCartProduct();
          return;
        }

        this.cartProduct.wine = res.body;
        this.cartProduct.totalPrice = this.cartProduct.quantity * res.body.currentPrice;
        this.loadStatus = LoadStatus.LOADED;

        this.updateCartProduct(this.cartProduct);

      }
    })
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
    const lastTotalPrice = this.cartProduct.totalPrice;
    
    if (operation == 'plus' && this.cartProduct.quantity + 1 <= this.cartProduct.wine.quantity) this.cartProduct.quantity++;
    if (operation == 'minus' && this.cartProduct.quantity - 1 > 0) this.cartProduct.quantity--;

    this.cartProduct.totalPrice = parseFloat((this.cartProduct.quantity * this.cartProduct.wine.currentPrice).toFixed(2)); 
    this.updateCartProduct(this.cartProduct);
    this.totalPriceChangeEvent.emit(this.cartProduct.totalPrice - lastTotalPrice);
  }




  getRoudendPrice(): number {
    return parseFloat(this.cartProduct.totalPrice.toFixed(2));
  }

}
