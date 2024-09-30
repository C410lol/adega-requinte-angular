import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from '../constants/ApiUrls';
import { Observable } from 'rxjs';
import { ResponseReturn } from '../types/ResponseReturn';
import { AddressType } from '../types/AddressType';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  private addressesUrl: string = ApiUrls.addressesUrl;




  constructor(
    private httpClient: HttpClient
  ) { }





  getByUserId(
    userId: string
  ): Observable<HttpResponse<ResponseReturn<AddressType[]>>> {
    return this.httpClient.get<ResponseReturn<AddressType[]>>(
      `${this.addressesUrl}/all?userId=${userId}`,
      {
        observe: 'response'
      }
    );
  }

}
