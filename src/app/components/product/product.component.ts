import { Component, Input } from '@angular/core';
import { WineType } from '../../types/WineType';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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




  getFirtsGrape(): string {
    if (this.wine.grapes.length < 1) return 'Nenhuma';
    if (this.wine.grapes.length > 1) return 'Uvas Variadas';
    return this.wine.grapes[0].name;
  }




  goToWinePage(): void {
    this.router.navigate([`/${this.wine.id}`]);
  }

}
