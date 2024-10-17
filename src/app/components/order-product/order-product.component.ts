import { Component, Input } from '@angular/core';
import { OrderProductType } from '../../types/OrderProductType';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-product.component.html',
  styleUrl: './order-product.component.css'
})
export class OrderProductComponent {

  @Input() orderProduct = {} as OrderProductType;




  constructor() { }




  getFirstImage(): string {
    if (this.orderProduct.product.images == null || this.orderProduct.product.images.length < 1) {
      return '../../assets/wine_img.png';
    }
    return this.orderProduct.product.images[0];
  }

}
