import { Component, OnInit } from '@angular/core';
import { WineType } from '../../types/WineType';
import { ActivatedRoute } from '@angular/router';
import { WinesService } from '../../services/wines.service';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { HttpClientModule } from '@angular/common/http';
import { CartWineType } from '../../types/CartWineType';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';
import { BackComponent } from "../../components/back/back.component";
import { ErrorComponent } from "../../components/error/error.component";
import { formatPriceNumber } from '../../constants/Utils';

@Component({
  selector: 'app-wine',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BackComponent, ErrorComponent],
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

  seletedImage: string = '';
  selectedImageIndex: number = 0;

  grapes: string = 'Nenhuma';

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

        if (res.body.images != null) this.seletedImage = res.body.images[0];

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
      subtotalPrice: totalPrice
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
      wine: this.wine, quantity: newQuantity, subtotalPrice: newTotalPrice 
    };
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

    this.dialogService.openDialogSuccess('Produto adicionado ao carrinho');

    return true;
  }




  increaseImageIndex(): void {
    if (this.wine.images == null) return;

    if (!(this.selectedImageIndex + 1 <= this.wine.images.length - 1)) return;
    this.seletedImage = this.wine.images[this.selectedImageIndex + 1];
    this.selectedImageIndex++;
  }

  decreaseImageIndex(): void {
    if (this.wine.images == null) return;

    if (!(this.selectedImageIndex - 1 >= 0)) return;
    this.seletedImage = this.wine.images[this.selectedImageIndex - 1];
    this.selectedImageIndex--;
  }

  toStringList(array?: any[]): string | void {
    if (array == null) return;

    if (array.length < 1) return;
    return array.map((e) => e.name).join(', ');
  }




  changeQuantity(operation: string): void {
    if (operation == 'plus' && this.quantity + 1 <= this.wine.quantity) this.quantity++;
    if (operation == 'minus' && this.quantity - 1 > 0) this.quantity--;
  }




  formatPriceNumber(number?: number): string {
    return formatPriceNumber(number);
  }




  ifProductsHasMoreThanOneImage(): boolean {
    if (this.wine.images == null) return false;
    if (this.wine.images.length < 2) return false;
    return true;
  }

}
