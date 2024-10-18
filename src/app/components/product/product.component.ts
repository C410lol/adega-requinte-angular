import { Component, Input } from '@angular/core';
import { WineType } from '../../types/WineType';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { formatPriceNumber } from '../../constants/Utils';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  @Input() wine = {} as WineType;




  constructor(
    private router: Router
  ) { }




  getFirstImage(): string {
    if (this.wine.images == null || this.wine.images.length < 1) return '../../assets/wine_img.png';
    return this.wine.images[0];
  }

  getMemberPrice(): number {
    return parseFloat(((this.wine.regPrice * 90) / 100).toFixed(2));
  }

  getNumberFormated(number?: number): string {
    return formatPriceNumber(number);
  }




  goToWinePage(): void {
    this.router.navigate([`/${this.wine.id}`]);
  }

}
