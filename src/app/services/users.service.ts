import { Injectable } from '@angular/core';
import { ApiUrls, AuthorizationHeader } from '../constants/API';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseReturn } from '../types/ResponseReturn';
import { AuthReturnType } from '../types/AuthReturnType';
import { UserType } from '../types/UserType';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = ApiUrls.usersUrl;




  constructor(
    private httpClient: HttpClient
  ) { }




  createUser(
    user: {name: string, email: string, phone: string, password: string}
  ): Observable<HttpResponse<ResponseReturn<AuthReturnType>>> {
    return this.httpClient.post<ResponseReturn<AuthReturnType>>(
      `${this.usersUrl}/save?authenticate=true`,
      user,
      {
        observe: 'response'
      }
    );
  }

  loginUser(
    login: {email: string, password: string}
  ): Observable<HttpResponse<ResponseReturn<AuthReturnType>>> {
    return this.httpClient.post<ResponseReturn<AuthReturnType>>(
      `${this.usersUrl}/login`,
      login,
      {
        observe: 'response'
      }
    )
  }


  // ------------------------------------------------------------------ //

  
  getClients(
    text?: string
  ): Observable<HttpResponse<ResponseReturn<UserType[]>>> {
    let url = `${this.usersUrl}/clients`;

    if (text != null && text.length > 0) url += `?text=${text}`;

    return this.httpClient.get<ResponseReturn<UserType[]>>(
      url,
      {
        headers: AuthorizationHeader(),
        observe: 'response'
      }
    );
  }


  getById(
    userId: string
  ): Observable<HttpResponse<ResponseReturn<UserType>>> {
    return this.httpClient.get<ResponseReturn<UserType>>(
      `${this.usersUrl}/${userId}`,
      {
        headers: AuthorizationHeader(),
        observe: 'response'
      }
    );
  }

}
