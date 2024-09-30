import { Injectable } from '@angular/core';
import { ApiUrls } from '../constants/ApiUrls';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseReturn } from '../types/ResponseReturn';
import { GrapeType } from '../types/GrapeType';

@Injectable({
  providedIn: 'root'
})
export class GrapesService {

  private grapesUrl = ApiUrls.grapesUrl;




  constructor(
    private httpClient: HttpClient
  ) { }




  findAllByName(
    name: string
  ): Observable<HttpResponse<ResponseReturn<GrapeType[]>>> {
    return this.httpClient.get<ResponseReturn<GrapeType[]>>(
      `${this.grapesUrl}/all-by-name?name=${name}`,
      {
        observe: 'response'
      }
    );
  }

}
