import { Component, OnInit } from '@angular/core';
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Sort } from '../../objects/Sort';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, CommonModule, CheckboxComponent],
  templateUrl: './filter.component.html',
  styleUrls: [
    '../../styles/input-styles.css',
    '../../styles/btn-styles.css',
    './filter.component.css'
  ]
})
export class FilterComponent implements OnInit {

  types: string[] = [];

  categories: string[] = [];
  countries: string[] = [];
  classifications: string[] = [];

  sortString: string = '{"orderBy":"name","direction":"asc"}';
  sort = {} as Sort;




  constructor(
    private dialogRef: MatDialogRef<FilterComponent>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }




  ngOnInit(): void {
    this.getQueryParams();
  }




  getQueryParams(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    const types = queryParams['types'];
    const categories = queryParams['categories'];
    const countries = queryParams['countries'];
    const classifications = queryParams['classifications'];
    const orderBy = queryParams['orderBy'];
    const direction = queryParams['direction'];    

    if (types != null) this.types = Array.isArray(types) ? types : [types];
    if (categories != null) this.categories = Array.isArray(categories) ? categories : [categories];
    if (countries != null) this.countries = Array.isArray(countries) ? countries : [countries];
    if (classifications != null) this.classifications = Array.isArray(classifications) ? classifications : [classifications];

    if (orderBy != null && direction != null) {
      this.sortString = JSON.stringify({orderBy: orderBy, direction: direction});
    }
  }




  typesCheck(check: {checked: boolean, value: string}): void {
    if (check.checked) {
      this.types.push(check.value);
    } else this.types.splice(this.types.indexOf(check.value), 1);
  }

  categoriesCheck(check: {checked: boolean, value: string}): void {
    if (check.checked) {
      this.categories.push(check.value);
    } else this.categories.splice(this.categories.indexOf(check.value), 1);
  }

  countriesCheck(check: {checked: boolean, value: string}): void {
    if (check.checked) {
      this.countries.push(check.value);
    } else this.countries.splice(this.countries.indexOf(check.value), 1);
  }

  classificationsCheck(check: {checked: boolean, value: string}): void {
    if (check.checked) {
      this.classifications.push(check.value);
    } else this.classifications.splice(this.classifications.indexOf(check.value), 1);
  }



  isInTypes(e: string): boolean {
    return this.types.includes(e);
  }

  isInCategories(e: string): boolean {
    return this.categories.includes(e);
  }

  isInCountries(e: string): boolean {
    return this.countries.includes(e);
  }

  isInClassifications(e: string): boolean {
    return this.classifications.includes(e);
  }



  
  applyFilters(): void {
    this.sort = JSON.parse(this.sortString);

    this.router.navigate(['/'], {
      queryParams: {
        types: this.types,
        categories: this.categories,
        countries: this.countries,
        classifications: this.classifications,
        orderBy: this.sort.orderBy,
        direction: this.sort.direction
      }
    });

    this.dialogRef.close('apply');
  }




  closeFilter(): void {
    this.dialogRef.close();
  }

}
