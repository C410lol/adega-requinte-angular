import { Component, Input } from '@angular/core';
import { CartWineType } from '../../types/CartWineType';

@Component({
  selector: 'app-checkout-product',
  standalone: true,
  imports: [],
  templateUrl: './checkout-product.component.html',
  styleUrl: './checkout-product.component.css'
})
export class CheckoutProductComponent {

  @Input() cartProduct = {} as CartWineType;




  constructor() { }




  getRoundedPrice(): number {
    return parseFloat(this.cartProduct.totalPrice.toFixed(2));
  }

}
