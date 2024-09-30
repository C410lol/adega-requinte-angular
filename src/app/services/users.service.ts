import { Injectable } from '@angular/core';
import { ApiUrls } from '../constants/ApiUrls';
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


  getById(
    userId: string
  ): Observable<HttpResponse<ResponseReturn<UserType>>> {
    return this.httpClient.get<ResponseReturn<UserType>>(
      `${this.usersUrl}/${userId}`,
      {
        observe: 'response'
      }
    );
  }

}
