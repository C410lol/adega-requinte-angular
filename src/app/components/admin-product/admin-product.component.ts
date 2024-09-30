import { Component, Input } from '@angular/core';
import { WineType } from '../../types/WineType';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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




  getFirstGrape(): string {
    if (this.product.grapes.length < 1) return 'Nenhuma';
    if (this.product.grapes.length > 1) return 'Uvas Variadas';
    return this.product.grapes[0].name;
  }

  ifHasProm(): string {
    if (this.product.hasProm) return 'SIM';
    return 'NÃO';
  }

}
