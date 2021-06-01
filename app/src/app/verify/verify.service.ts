import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIURL, GenericResponse } from '../util';

@Injectable({
  providedIn: 'root',
})
export class VerifyService {
  constructor(private http: HttpClient) {}

  public async verifyAccount(verifyID: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/verify_account', {
          params: { verify_id: verifyID },
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
}
