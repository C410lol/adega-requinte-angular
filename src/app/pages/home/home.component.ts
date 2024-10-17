import { Component, OnInit } from '@angular/core';
import { ProductComponent } from "../../components/product/product.component";
import { WinesService } from '../../services/wines.service';
import { WineType } from '../../types/WineType';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoadStatus } from '../../constants/LoadStatusEnum';
import { ErrorComponent } from '../../components/error/error.component';
import { FilterComponent } from "../../components/filter/filter.component";
import { MatDialog } from '@angular/material/dialog';
import { ProductsFilter } from '../../objects/ProductsFilter';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Sort } from '../../objects/Sort';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ProductComponent, ErrorComponent],
  providers: [WinesService],
  templateUrl: './home.component.html',
  styleUrls: [
    '../../styles/product-styles.css',
    '../../styles/btn-styles.css',
    './home.component.css',
  ],
})
export class HomeComponent implements OnInit {

  loadStatus: LoadStatus = LoadStatus.LOADING;

  nameFilter?: string;
  filter?: ProductsFilter;
  wines: WineType[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private winesService: WinesService,
    private matDialog: MatDialog
  ) { }




  ngOnInit(): void {
    this.getQueryParams();
    this.getAllWines();
  }




  getQueryParams(): void {
    this.setFilter(this.activatedRoute.snapshot.queryParams);

    this.activatedRoute.queryParams.subscribe({
      next: (res) => {

        if (res['name'] != null) {
          this.nameFilter = res['name'];
          this.getAllWines();
        }

      }
    });
  }




  getAllWines() {
    this.loadStatus = LoadStatus.LOADING;
    this.winesService.getAllWines(this.nameFilter, this.filter).subscribe({
      next: (res) => {

        if (!res.ok || res.body == null) { 
          this.loadStatus = LoadStatus.ERROR; 
          return; 
        }

        if (res.body.value.empty) {
          this.loadStatus = LoadStatus.EMPTY; 
          return;
        }

        this.wines = res.body.value.content;
        this.loadStatus = LoadStatus.LOADED; 

      },
      error: (err) => {
        
        console.error(err);
        this.loadStatus = LoadStatus.ERROR; 

      }
    });
  }




  openFilter(): void {
    this.matDialog.open(FilterComponent, {
      width: '100vw', 
      height: '100vh',
      panelClass: 'filter-dialog',
      data: this.filter
    }).afterClosed().subscribe({
      next: (res) => {

        if (res == 'apply') {
          this.setFilter(this.activatedRoute.snapshot.queryParams);
          this.getAllWines();
        }
      }
    });
  }



  setFilter(queryParams: Params): void {
    let filter = {} as ProductsFilter;

    const types = queryParams['types'];
    const categories = queryParams['categories'];
    const countries = queryParams['countries'];
    const classifications = queryParams['classifications'];
    const orderBy = queryParams['orderBy'];
    const direction = queryParams['direction'];

    if (types != null) filter.types = Array.isArray(types) ? types : [types];
    if (categories != null) filter.categories = Array.isArray(categories) ? categories : [categories];
    if (countries != null) filter.countries = Array.isArray(countries) ? countries : [countries];
    if (classifications != null) filter.classifications = Array.isArray(classifications) ? classifications : [classifications];

    let sort = {} as Sort;
    if (orderBy != null) sort.orderBy = orderBy;
    if (direction != null) sort.direction = direction;

    filter.sort = sort;
    this.filter = filter;
  }




  setFilterQueryParams(filter: ProductsFilter): void {
    this.router.navigate(['/'], {
      queryParams: {
        types: filter.types,
        categories: filter.categories,
        countries: filter.countries,
        classifications: filter.classifications,
        orderBy: filter.sort.orderBy,
        direction: filter.sort.direction
      }
    });
  }




  ifQueryParamsExists(): boolean {
    return this.activatedRoute.snapshot.queryParamMap.keys.length != 0;
  }

  clearQueryParams(): void {
    this.router.navigate([], {queryParams: {}});
    this.filter = undefined;
    this.nameFilter = undefined;
    this.getAllWines();
  }

}
