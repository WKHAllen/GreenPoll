import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIURL, GenericResponse } from '../util';

export interface PollInfo {
  id?: number;
  user_id?: number;
  title?: string;
  description?: string;
  create_time?: number;
  error?: string;
}

export interface PollOptionInfo {
  id?: number;
  poll_id?: number;
  value?: string;
  error?: string;
}

export interface PollVoteInfo {
  id?: number;
  user_id?: number;
  poll_id?: number;
  poll_option_id?: number;
  vote_time?: number;
  error?: string;
}

export interface PollUserVoteInfo {
  user_id?: number;
  username?: string;
  poll_option_id?: number;
  poll_option_value?: string;
  vote_time?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PollService {
  constructor(private http: HttpClient) {}

  public async createPoll(
    title: string,
    description: string
  ): Promise<PollInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollInfo>(APIURL + '/create_poll', {
          params: { title, description },
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

  public async getPollInfo(pollID: number): Promise<PollInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollInfo>(APIURL + '/get_poll_info', {
          params: { poll_id: pollID },
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

  public async getPollOptions(pollID: number): Promise<PollOptionInfo[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollOptionInfo[]>(APIURL + '/get_poll_options', {
          params: { poll_id: pollID },
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

  public async getPollVotes(pollID: number): Promise<PollVoteInfo[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollVoteInfo[]>(APIURL + '/get_poll_votes', {
          params: { poll_id: pollID },
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

  public async setPollTitle(pollID: number, title: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/set_poll_title', {
          params: { poll_id: pollID, title },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (!res.error) {
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async setPollDescription(
    pollID: number,
    description: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/set_poll_description', {
          params: { poll_id: pollID, description },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (!res.error) {
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async deletePoll(pollID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/delete_poll', {
          params: { poll_id: pollID },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (!res.error) {
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async createPollOption(
    pollID: number,
    value: string
  ): Promise<PollOptionInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollOptionInfo>(APIURL + '/create_poll_option', {
          params: { poll_id: pollID, value },
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

  public async getPollOptionInfo(
    pollOptionID: number
  ): Promise<PollOptionInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollOptionInfo>(APIURL + '/get_poll_option_info', {
          params: { poll_option_id: pollOptionID },
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

  public async setPollOptionValue(
    pollOptionID: number,
    value: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/set_poll_option_value', {
          params: { poll_option_id: pollOptionID, new_value: value },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (!res.error) {
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async getPollOptionPoll(pollOptionID: number): Promise<PollInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollInfo>(APIURL + '/get_poll_option_poll', {
          params: { poll_option_id: pollOptionID },
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

  public async deletePollOption(pollOptionID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<GenericResponse>(APIURL + '/delete_poll_option', {
          params: { poll_option_id: pollOptionID },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (!res.error) {
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async pollVote(pollOptionID: number): Promise<PollVoteInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollVoteInfo>(APIURL + '/poll_vote', {
          params: { poll_option_id: pollOptionID },
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

  public async pollUnvote(pollID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollVoteInfo>(APIURL + '/poll_unvote', {
          params: { poll_id: pollID },
          withCredentials: true,
        })
        .subscribe((res) => {
          if (!res.error) {
            resolve();
          } else {
            reject(res.error);
          }
        });
    });
  }

  public async getPollVotePoll(pollVoteID: number): Promise<PollInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollInfo>(APIURL + '/get_poll_vote_poll', {
          params: { poll_vote_id: pollVoteID },
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

  public async getUserVote(pollID: number): Promise<PollVoteInfo> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollVoteInfo>(APIURL + '/get_user_vote', {
          params: { poll_id: pollID },
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

  public async getPollUserVotes(pollID: number): Promise<PollUserVoteInfo[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<PollUserVoteInfo[]>(APIURL + '/get_poll_user_votes', {
          params: { poll_id: pollID },
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
