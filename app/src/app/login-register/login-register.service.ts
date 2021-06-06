import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { apiRequest } from '../util';

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
    await apiRequest(this.http, '/register', { username, email, password });
  }

  public async login(email: string, password: string): Promise<void> {
    await apiRequest(this.http, '/login', { email, password });
    this.setLoggedIn(true);
  }

  public async logout(): Promise<void> {
    await apiRequest(this.http, '/logout');
    this.setLoggedIn(false);
  }

  public async logoutEverywhere(): Promise<void> {
    await apiRequest(this.http, '/logout_everywhere');
    this.setLoggedIn(false);
  }

  public loggedIn(): boolean {
    return localStorage.getItem(this.loggedInName) === 'true';
  }

  private setLoggedIn(loggedIn: boolean): void {
    localStorage.setItem(this.loggedInName, String(loggedIn));
    this.loggedInChange.next(loggedIn);
  }
}
