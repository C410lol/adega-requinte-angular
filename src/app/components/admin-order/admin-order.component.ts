import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderType } from '../../types/OrderType';
import { Router } from '@angular/router';
import { formatPriceNumber } from '../../constants/Utils';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-order.component.html',
  styleUrls: [
    './admin-order.component.css',
    './admin-order.mobile.component.css'
  ]
})
export class AdminOrderComponent {

  @Input() order = {} as OrderType;




  constructor(
    private router: Router
  ) { }




 formatPriceNumber(number?: number): string {
    return formatPriceNumber(number);
  }




  goToOrder(): void {
    this.router.navigate([`${this.router.url}/order/${this.order.id}`]);
  }

}
