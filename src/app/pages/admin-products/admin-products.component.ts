import { Component, OnInit } from '@angular/core';
import { ProductComponent } from "../../components/product/product.component";
import { AdminProductComponent } from "../../components/admin-product/admin-product.component";
import { WineType } from '../../types/WineType';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { WinesService } from '../../services/wines.service';
import { Router, RouterModule } from '@angular/router';
import { ErrorComponent } from "../../components/error/error.component";

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, ProductComponent, AdminProductComponent, ErrorComponent],
  providers: [WinesService],
  templateUrl: './admin-products.component.html',
  styleUrls: [
    '../../styles/product-styles.css',
    './admin-products.component.css',
  ]
})
export class AdminProductsComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  products: WineType[] = [];




  constructor(
    private router: Router,
    private winesService: WinesService
  ) { }




  ngOnInit(): void {
    this.getProducts();
  }




  getProducts(): void {
    this.winesService.getAllWines().subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) {
          this.loadStatus = LoadStatus.ERROR;
          return;
        }

        if (res.body.empty) {
          this.loadStatus = LoadStatus.EMPTY;
          return;
        }

        this.products = res.body.content;
        this.loadStatus = LoadStatus.LOADED;

      },
      error: (err) => {

        console.error(err);
        this.loadStatus = LoadStatus.ERROR;

      }
    })
  }




  goToCreateProductPage(): void {
    this.router.navigate([`${this.router.url}/product`]);
  }

}
