import { Component, Input } from '@angular/core';
import { OrderType } from '../../types/OrderType';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { formatPriceNumber } from '../../constants/Utils';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order.component.html',
  styleUrls: [
    './order.component.css',
    './order.mobile.component.css'
  ]
})
export class OrderComponent {

  @Input() navigateUrl?: boolean;

  @Input() order = {} as OrderType;




  constructor(
    private router: Router
  ) { }




  formatPriceNumber(number?: number): string {
    return formatPriceNumber(number);
  }




  goToOrder(): void {
    if (this.navigateUrl != null && this.navigateUrl) return;
    this.router.navigate([`${this.router.url}/${this.order.id}`]);
  }

}
