import { Component, Input } from '@angular/core';
import { OrderType } from '../../types/OrderType';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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

  @Input() order = {} as OrderType;




  constructor(
    private router: Router
  ) { }




  getFormatedDate(): string {
    return this.order.date.split('-').reverse().join('/');
  }

  getFormatedEnum(string: string): string {
    return string[0] + string.slice(1).toLowerCase();
  }




  goToOrder(): void {
    this.router.navigate([`${this.router.url}/${this.order.id}`]);
  }

}
