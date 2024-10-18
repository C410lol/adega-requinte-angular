import { Component, Input } from '@angular/core';
import { CartWineType } from '../../types/CartWineType';
import { CommonModule } from '@angular/common';
import { formatPriceNumber } from '../../constants/Utils';

@Component({
  selector: 'app-checkout-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-product.component.html',
  styleUrl: './checkout-product.component.css'
})
export class CheckoutProductComponent {

  @Input() cartProduct = {} as CartWineType;




  constructor() { }




  getFirstImage(): string {
    if (this.cartProduct.wine.images == null || this.cartProduct.wine.images.length < 1) return '../../assets/wine_img.png';
    return this.cartProduct.wine.images[0];
  }

  getRoundedPrice(): number {
    return parseFloat(this.cartProduct.subtotalPrice.toFixed(2));
  }

  formatPriceNumber(number?: number): string {
    return formatPriceNumber(number);
  }

}
