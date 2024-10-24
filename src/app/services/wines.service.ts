import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WineType } from '../types/WineType';
import { ApiUrls, AuthorizationHeader } from '../constants/API';
import { PageType } from '../types/PageType';
import { ResponseReturn } from '../types/ResponseReturn';
import { ProductsFilter } from '../objects/ProductsFilter';

@Injectable({
  providedIn: 'root'
})
export class WinesService {

  private winesUrl = ApiUrls.winesUrl;




  constructor(
    private httpClient: HttpClient
  ) { }




  getAllWines(
    nameFilter?: string,
    filter?: ProductsFilter
  ): Observable<HttpResponse<ResponseReturn<PageType<WineType>>>> {
    let url = `${this.winesUrl}/all?`;

    if (nameFilter != null) url += `name=${nameFilter}&`;

    if (filter != null) {

      if (filter.types != null && filter.types.length > 0) {
        url += `types=${filter.types.toString()}&`;
      }
      if (filter.categories != null && filter.categories.length > 0) {
        url += `categories=${filter.categories.toString()}&`;
      }
      if (filter.countries != null && filter.countries.length > 0) {
        url += `countries=${filter.countries.toString()}&`;
      }
      if (filter.classifications != null && filter.classifications.length > 0) {
        url += `classifications=${filter.classifications.toString()}&`;
      }
      if (filter.sort.orderBy != null && filter.sort.direction != null) {
        url += `orderBy=${filter.sort.orderBy}&direction=${filter.sort.direction}`;
      }
      
    }

    return this.httpClient.get<ResponseReturn<PageType<WineType>>>(
      url,
      {
        observe: 'response'
      },
    )
  }

  getAllByText(
    text?: string
  ): Observable<HttpResponse<ResponseReturn<WineType[]>>> {
    let url = `${this.winesUrl}/all-by-text`;

    if (text != null && text.trim().length > 0) url += `?text=${text}`;

    return this.httpClient.get<ResponseReturn<WineType[]>>(
      url,
      {
        headers: AuthorizationHeader(),
        observe: 'response'
      }
    );
  }

  getWineById(wineId: string): Observable<HttpResponse<WineType>> {
    return this.httpClient.get<WineType>(
      `${this.winesUrl}/${wineId}`,
      {
        observe: 'response'
      }
    )
  }


  // ------------------------------------------------------------------ //


  save(
    form: FormData
  ): Observable<HttpResponse<ResponseReturn<WineType>>> {
    return this.httpClient.post<ResponseReturn<WineType>>(
      `${this.winesUrl}/save`,
      form,
      {
        headers: AuthorizationHeader(),
        observe: 'response'
      }
    );
  }


  // ------------------------------------------------------------------ //


  edit(
    productId: string,
    form: FormData
  ): Observable<HttpResponse<ResponseReturn<WineType>>> {
    return this.httpClient.put<ResponseReturn<WineType>>(
      `${this.winesUrl}/${productId}`,
      form,
      {
        headers: AuthorizationHeader(),
        observe: 'response'
      }
    );
  }


  // ------------------------------------------------------------------ //


  delete(
    productId: string
  ): Observable<HttpResponse<ResponseReturn<null>>> {
    return this.httpClient.delete<ResponseReturn<null>>(
      `${this.winesUrl}/${productId}`,
      {
        headers: AuthorizationHeader(),
        observe: 'response'
      }
    );
  }

}
