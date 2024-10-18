import { Component, Input } from '@angular/core';
import { WineType } from '../../types/WineType';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { formatPriceNumber } from '../../constants/Utils';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent {

  @Input() product = {} as WineType;
  
  


  constructor(
    private router: Router
  ) { }




  goToAdminProductPage(): void {
    this.router.navigate([`${this.router.url}/product/${this.product.id}`]);
  }




  getFirstImage(): string {
    if (this.product.images == null || this.product.images.length < 1) return '../../assets/wine_img.png';
    return this.product.images[0];
  }

  formatPriceNumber(number?: number): string {
    return formatPriceNumber(number);
  }




  ifHasProm(): string {
    if (this.product.hasProm) return 'SIM';
    return 'NÃO';
  }

}
