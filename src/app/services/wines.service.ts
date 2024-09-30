import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WineType } from '../types/WineType';
import { ApiUrls } from '../constants/ApiUrls';
import { PageType } from '../types/PageType';
import { ProductDTO } from '../dtos/ProductDTO';
import { ResponseReturn } from '../types/ResponseReturn';

@Injectable({
  providedIn: 'root'
})
export class WinesService {

  private winesUrl = ApiUrls.winesUrl;




  constructor(
    private httpClient: HttpClient
  ) { }




  getAllWines(): Observable<HttpResponse<PageType<WineType>>> {
    return this.httpClient.get<PageType<WineType>>(
      `${this.winesUrl}/all`,
      {
        observe: 'response'
      },
    )
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
    product: ProductDTO
  ): Observable<HttpResponse<ResponseReturn<WineType>>> {
    return this.httpClient.post<ResponseReturn<WineType>>(
      `${this.winesUrl}/save`,
      product,
      {
        observe: 'response'
      }
    );
  }


  // ------------------------------------------------------------------ //


  edit(
    productId: string,
    product: ProductDTO
  ): Observable<HttpResponse<ResponseReturn<WineType>>> {
    return this.httpClient.put<ResponseReturn<WineType>>(
      `${this.winesUrl}/${productId}`,
      product,
      {
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
        observe: 'response'
      }
    );
  }

}
