import { Component, OnInit } from '@angular/core';
import { ProductComponent } from "../../components/product/product.component";
import { WinesService } from '../../services/wines.service';
import { WineType } from '../../types/WineType';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { ErrorComponent } from '../../components/error/error.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ProductComponent, ErrorComponent],
  providers: [WinesService],
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
    '../../styles/product-styles.css'
  ],
})
export class HomeComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  wines: WineType[] = [];

  constructor(
    private winesService: WinesService
  ) { }




  ngOnInit(): void {
    this.getAllWines();
  }




  getAllWines() {
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

        this.wines = res.body.content;
        this.loadStatus = LoadStatus.LOADED; 

      },
      error: (err) => {
        
        console.error(err);
        this.loadStatus = LoadStatus.ERROR; 

      }
    })
  }

}
