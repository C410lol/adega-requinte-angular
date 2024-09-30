import { Component, OnInit } from '@angular/core';
import { WineType } from '../../types/WineType';
import { ActivatedRoute } from '@angular/router';
import { WinesService } from '../../services/wines.service';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { HttpClientModule } from '@angular/common/http';
import { CartWineType } from '../../types/CartWineType';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-wine',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [WinesService],
  templateUrl: './wine.component.html',
  styleUrls: [
    './wine.component.css'
  ]
})
export class WineComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING; 

  wineId: string = '';
  wine = {} as WineType;

  quantity: number = 1;
  



  constructor(
    activeRoute: ActivatedRoute,
    private winesService: WinesService,
    private dialogService: DialogService
  ) {
    activeRoute.params.subscribe({
      next: (res) => this.wineId = res['productId']
    });
  }




  ngOnInit(): void {
    this.getWine();
  }




  getWine(): void {
    this.winesService.getWineById(this.wineId).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        this.wine = res.body;
        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.loadStatus = LoadStatus.ERROR;

      }
    })
  }




  addToCart(): void {
    let cartProducts: CartWineType[];
    let totalPrice: number = this.quantity * this.wine.currentPrice;

    const cartProductsLocalStorage = localStorage.getItem('cartProducts');
    if (cartProductsLocalStorage == null) { 
      cartProducts = []; 
    } else {
      cartProducts = JSON.parse(cartProductsLocalStorage);      
    }

    if (this.ifProductExists(cartProducts)) return;

    cartProducts.push({ 
      wine: this.wine, 
      quantity: this.quantity, 
      totalPrice: totalPrice
    });

    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

    this.dialogService.openDialogSuccess('Produto adicionado ao carrinho');
  }

  ifProductExists(cartProducts: CartWineType[]): boolean {
    const cartProduct = cartProducts.find((e) => e.wine.id == this.wineId);
    if (cartProduct == null) return false;

    const cartProductIndex = cartProducts.indexOf(cartProduct);

    let newQuantity = this.quantity + cartProduct.quantity;
    if (newQuantity > this.wine.quantity) {
      newQuantity = this.wine.quantity; 
    }
    const newTotalPrice = newQuantity * this.wine.currentPrice;

    cartProducts[cartProductIndex] = { 
      wine: this.wine, quantity: newQuantity, totalPrice: newTotalPrice 
    };
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

    this.dialogService.openDialogSuccess('Produto adicionado ao carrinho');

    return true;
  }




  getGrapes(): string {
    if (this.wine.grapes.length < 1) return 'Nenhuma';
    return this.wine.grapes.map((e) => e.name).join('; ');
  }




  changeQuantity(operation: string): void {
    if (operation == 'plus' && this.quantity + 1 <= this.wine.quantity) this.quantity++;
    if (operation == 'minus' && this.quantity - 1 > 0) this.quantity--;
  }

}
