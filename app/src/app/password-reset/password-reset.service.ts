import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIURL, GenericResponse } from '../util';

interface PasswordResetExistsResponse {
  exists?: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  constructor(private http: HttpClient) {}

  public async requestPasswordReset(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/request_password_reset', {
          params: { email },
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

  public async passwordResetExists(resetID: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PasswordResetExistsResponse>(APIURL + '/password_reset_exists', {
          params: { reset_id: resetID },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (res.exists !== undefined) {
            resolve(res.exists);
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async resetPassword(
    resetID: string,
    newPassword: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/reset_password', {
          params: { reset_id: resetID, new_password: newPassword },
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
}
