import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from '../constants/ApiUrls';
import { OrderDTO } from '../dtos/OrderDTO';
import { Observable } from 'rxjs';
import { ResponseReturn } from '../types/ResponseReturn';
import { OrderType } from '../types/OrderType';
import { PageType } from '../types/PageType';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private ordersUrl: string = ApiUrls.ordersUrl;




  constructor(
    private httpClient: HttpClient
  ) { }




  save(
    userId: string,
    order: OrderDTO,
    addressId: string | null
  ): Observable<HttpResponse<ResponseReturn<any>>> {
    let url = `${this.ordersUrl}/save?userId=${userId}`;
    if (addressId != null && addressId.trim().length > 0) {
      url = url + `&addressId=${addressId}`;
    }

    return this.httpClient.post<ResponseReturn<any>>(
      url,
      order,
      {
        observe: 'response'
      }
    );
  }


  // ------------------------------------------------------------------ //


  getAll(): Observable<HttpResponse<ResponseReturn<PageType<OrderType>>>> {
    return this.httpClient.get<ResponseReturn<PageType<OrderType>>>(
      `${this.ordersUrl}/all`,
      {
        observe: 'response'
      }
    );
  }

  getAllByUserId(
    userId: string
  ): Observable<HttpResponse<ResponseReturn<OrderType[]>>> {
    return this.httpClient.get<ResponseReturn<OrderType[]>>(
      `${this.ordersUrl}/all-by-user?userId=${userId}`,
      {
        observe: 'response'
      }
    );
  }

  getById(
    orderId: string
  ): Observable<HttpResponse<ResponseReturn<OrderType>>> {
    return this.httpClient.get<ResponseReturn<OrderType>>(
      `${this.ordersUrl}/${orderId}`,
      {
        observe: 'response'
      }
    );
  }


  // ------------------------------------------------------------------ //


  cancelOrder(
    orderId: string
  ): Observable<HttpResponse<ResponseReturn<null>>> {
    return this.httpClient.put<ResponseReturn<null>>(
      `${this.ordersUrl}/${orderId}/cancel`,
      null,
      {
        observe: 'response'
      }
    );
  }

}
