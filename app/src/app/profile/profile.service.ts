import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PollInfo } from '../poll/poll.service';
import { APIURL, GenericResponse } from '../util';

export interface UserInfo {
  id?: number;
  username?: string;
  email?: string;
  join_time?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  public async getUserInfo(): Promise<UserInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<UserInfo>(APIURL + '/get_user_info', {
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

  public async setUsername(newUsername: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/set_username', {
          params: { new_username: newUsername },
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

  public async setPassword(newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/set_password', {
          params: { new_password: newPassword },
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

  public async getUserPolls(): Promise<PollInfo[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollInfo[]>(APIURL + '/get_user_polls', {
          withCredentials: true,
        })
        .subscribe((res) => {
          if (!('error' in res)) {
            resolve(res);
          } else {
            reject(res['error']);
          }
        });
    });
  }
}
