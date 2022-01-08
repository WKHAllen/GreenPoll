import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiRequest } from '../util';

@Injectable({
  providedIn: 'root',
})
export class VerifyService {
  constructor(private http: HttpClient) {}

  public async verifyAccount(verifyID: string): Promise<void> {
    await apiRequest(this.http, '/verify_account', { verify_id: verifyID });
  }
}
