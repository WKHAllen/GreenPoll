import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiRequest } from '../util';

export interface SpecificUserInfo {
  id: number;
  username: string;
  join_time: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public async getSpecificUserInfo(userID: number): Promise<SpecificUserInfo> {
    return await apiRequest<SpecificUserInfo>(
      this.http,
      '/get_specific_user_info',
      { user_id: userID }
    );
  }
}
