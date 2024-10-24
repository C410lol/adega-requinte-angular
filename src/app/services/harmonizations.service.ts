import { Injectable } from '@angular/core';
import { ApiUrls, AuthorizationHeader } from '../constants/API';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HarmonizationType } from '../types/HarmonizationType';
import { ResponseReturn } from '../types/ResponseReturn';

@Injectable({
  providedIn: 'root'
})
export class HarmonizationsService {

  private harmonizationsUrl: string = ApiUrls.harmonizationsUrl;

  constructor(
    private httpClient: HttpClient
  ) { }




  findAllByName(
    name: string
  ): Observable<HttpResponse<ResponseReturn<HarmonizationType[]>>> {
    return this.httpClient.get<ResponseReturn<HarmonizationType[]>>(
      `${this.harmonizationsUrl}/all-by-name?name=${name}`,
      {
        headers: AuthorizationHeader(),
        observe: 'response'
      }
    );
  }

}
