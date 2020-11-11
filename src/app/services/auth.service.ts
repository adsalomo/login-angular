import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';

import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = '';
  private userToken: string;

  constructor(private http: HttpClient) {
    this.readToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login(user: UserModel) {
    const authData = {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        console.log('Entro en el map');
        this.saveToken(resp['idToken']);
        return resp;
      })
    );
  }

  signIn(user: UserModel) {
    const authData = {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${this.url}signUp?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        console.log('Entro en el map');

        this.saveToken(resp['idToken']);
        return resp;
      })
    );
  }

  private saveToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', this.userToken);
    let currentDate = new Date();
    currentDate.setSeconds(3600);
    localStorage.setItem('expire', currentDate.getTime().toString())
  }

  readToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  isAuth(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    let expire = Number(localStorage.getItem('expire'));
    const expireDate = new Date();
    expireDate.setTime(expire);

    if (expireDate > new Date()) {
      return true;
    }

    return false;
  }
}
