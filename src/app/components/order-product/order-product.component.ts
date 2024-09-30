import { Component, Input } from '@angular/core';
import { OrderProductType } from '../../types/OrderProductType';

@Component({
  selector: 'app-order-product',
  standalone: true,
  imports: [],
  templateUrl: './order-product.component.html',
  styleUrl: './order-product.component.css'
})
export class OrderProductComponent {

  @Input() orderProduct = {} as OrderProductType;




  constructor() { }

}
