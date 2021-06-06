import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiRequest } from '../util';

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

export interface PollVoterInfo {
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
    return await apiRequest<PollInfo>(this.http, '/create_poll', {
      title,
      description,
    });
  }

  public async getPollInfo(pollID: number): Promise<PollInfo> {
    return await apiRequest<PollInfo>(this.http, '/get_poll_info', {
      poll_id: pollID,
    });
  }

  public async getPollOptions(pollID: number): Promise<PollOptionInfo[]> {
    return await apiRequest<PollOptionInfo[]>(this.http, '/get_poll_options', {
      poll_id: pollID,
    });
  }

  public async getPollVotes(pollID: number): Promise<PollVoteInfo[]> {
    return await apiRequest<PollVoteInfo[]>(this.http, '/get_poll_votes', {
      poll_id: pollID,
    });
  }

  public async setPollTitle(pollID: number, title: string): Promise<void> {
    await apiRequest(this.http, '/set_poll_title', { poll_id: pollID, title });
  }

  public async setPollDescription(
    pollID: number,
    description: string
  ): Promise<void> {
    await apiRequest(this.http, '/set_poll_description', {
      poll_id: pollID,
      description,
    });
  }

  public async deletePoll(pollID: number): Promise<void> {
    await apiRequest(this.http, '/delete_poll', { poll_id: pollID });
  }

  public async createPollOption(
    pollID: number,
    value: string
  ): Promise<PollOptionInfo> {
    return await apiRequest<PollOptionInfo>(this.http, '/create_poll_option', {
      poll_id: pollID,
      value,
    });
  }

  public async getPollOptionInfo(
    pollOptionID: number
  ): Promise<PollOptionInfo> {
    return await apiRequest<PollOptionInfo>(
      this.http,
      '/get_poll_option_info',
      { poll_option_id: pollOptionID }
    );
  }

  public async setPollOptionValue(
    pollOptionID: number,
    value: string
  ): Promise<void> {
    await apiRequest(this.http, '/set_poll_option_value', {
      poll_option_id: pollOptionID,
      new_value: value,
    });
  }

  public async getPollOptionPoll(pollOptionID: number): Promise<PollInfo> {
    return await apiRequest<PollInfo>(this.http, '/get_poll_option_poll', {
      poll_option_id: pollOptionID,
    });
  }

  public async deletePollOption(pollOptionID: number): Promise<void> {
    await apiRequest(this.http, '/delete_poll_option', {
      poll_option_id: pollOptionID,
    });
  }

  public async pollVote(pollOptionID: number): Promise<PollVoteInfo> {
    return await apiRequest<PollVoteInfo>(this.http, '/poll_vote', {
      poll_option_id: pollOptionID,
    });
  }

  public async pollUnvote(pollID: number): Promise<void> {
    await apiRequest(this.http, '/poll_unvote', { poll_id: pollID });
  }

  public async getPollVotePoll(pollVoteID: number): Promise<PollInfo> {
    return await apiRequest<PollInfo>(this.http, '/get_poll_vote_poll', {
      poll_vote_id: pollVoteID,
    });
  }

  public async getUserVote(pollID: number): Promise<PollVoteInfo> {
    return await apiRequest<PollVoteInfo>(this.http, '/get_user_vote', {
      poll_id: pollID,
    });
  }

  public async getPollVoters(pollID: number): Promise<PollVoterInfo[]> {
    return await apiRequest<PollVoterInfo[]>(this.http, '/get_poll_voters', {
      poll_id: pollID,
    });
  }
}
