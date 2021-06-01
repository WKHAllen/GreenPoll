import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { APIURL, GenericResponse } from '../util';

@Injectable({
  providedIn: 'root',
})
export class LoginRegisterService {
  private loggedInName = 'loggedIn';
  loggedInChange = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  public async register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/register', {
          params: { username, email, password },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (res.success) {
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/login', {
          params: { email, password },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (res.success) {
            this.setLoggedIn(true);
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/logout', {
          withCredentials: true,
        })
        .subscribe((res) => {
          if (res.success) {
            this.setLoggedIn(false);
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async logoutEverywhere(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/logout_everywhere', {
          withCredentials: true,
        })
        .subscribe((res) => {
          if (res.success) {
            this.setLoggedIn(false);
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public loggedIn(): boolean {
    return localStorage.getItem(this.loggedInName) === 'true';
  }

  private setLoggedIn(loggedIn: boolean): void {
    localStorage.setItem(this.loggedInName, String(loggedIn));
    this.loggedInChange.next(loggedIn);
  }
}
