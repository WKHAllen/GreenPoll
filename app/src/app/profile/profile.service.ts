import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PollInfo } from '../poll/poll.service';
import { apiRequest } from '../util';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  join_time: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  public async getUserInfo(): Promise<UserInfo> {
    return await apiRequest<UserInfo>(this.http, '/get_user_info');
  }

  public async setUsername(newUsername: string): Promise<void> {
    await apiRequest(this.http, '/set_username', { new_username: newUsername });
  }

  public async setPassword(newPassword: string): Promise<void> {
    await apiRequest(this.http, '/set_password', { new_password: newPassword });
  }

  public async getUserPolls(): Promise<PollInfo[]> {
    return await apiRequest<PollInfo[]>(this.http, '/get_user_polls');
  }

  public async getUserVotePolls(): Promise<PollInfo[]> {
    return await apiRequest<PollInfo[]>(this.http, '/get_user_vote_polls');
  }
}
