import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIURL } from '../util';

export interface SpecificUserInfo {
  id?: number;
  username?: string;
  join_time?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public async getSpecificUserInfo(userID: number): Promise<SpecificUserInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<SpecificUserInfo>(APIURL + '/get_specific_user_info', {
          params: { user_id: userID },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (!res.error) {
            resolve(res);
          } else {
            reject(res.error);
          }
        });
    });
  }
}
