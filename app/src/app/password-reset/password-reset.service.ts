import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiRequest } from '../util';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  constructor(private http: HttpClient) {}

  public async requestPasswordReset(email: string): Promise<void> {
    await apiRequest(this.http, '/request_password_reset', { email });
  }

  public async passwordResetExists(resetID: string): Promise<boolean> {
    return await apiRequest<boolean>(this.http, '/password_reset_exists', {
      reset_id: resetID,
    });
  }

  public async resetPassword(
    resetID: string,
    newPassword: string
  ): Promise<void> {
    await apiRequest(this.http, '/reset_password', {
      reset_id: resetID,
      new_password: newPassword,
    });
  }
}
