/**
 * Services for poll vote functions.
 * @packageDocumentation
 */

import { BaseService } from "./util";
import { Poll } from "./poll";

/**
 * Poll vote architecture.
 */
export interface PollVote {
  id: number;
  user_id: number;
  poll_id: number;
  poll_option_id: number;
  vote_time: number;
}

/**
 * Poll vote services
 */
export class PollVoteService extends BaseService {
  /**
   * Returns whether or not a user has voted on a poll.
   *
   * @param userID The ID of the user.
   * @param pollID The ID of the poll.
   * @returns Whether or not the user has voted on the poll.
   */
  public async pollVoteExists(
    userID: number,
    pollID: number
  ): Promise<boolean> {
    const res = await this.dbm.executeFile<PollVote>(
      "poll_vote/get_poll_vote.sql",
      [userID, pollID]
    );
    return res.length === 1;
  }

  /**
   * Returns a poll vote record.
   *
   * @param userID The ID of the user who voted on the poll.
   * @param pollID The ID of the poll.
   * @returns The poll vote record.
   */
  public async getPollVote(userID: number, pollID: number): Promise<PollVote> {
    const res = await this.dbm.executeFile<PollVote>(
      "poll_vote/get_poll_vote.sql",
      [userID, pollID]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new Error("Poll vote does not exist");
    }
  }

  /**
   * Returns a poll vote record given the poll vote ID.
   *
   * @param pollVoteID The ID of the poll vote.
   * @returns The poll vote record.
   */
  public async getPollVoteByVoteID(pollVoteID: number): Promise<PollVote> {
    const res = await this.dbm.executeFile<PollVote>(
      "poll_vote/get_poll_vote_by_vote_id.sql",
      [pollVoteID]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new Error("Poll vote does not exist");
    }
  }

  /**
   * Returns the poll associated with a poll vote.
   *
   * @param pollVoteID The ID of the poll vote.
   * @returns The poll associated with the poll vote.
   */
  public async getPollVotePoll(pollVoteID: number): Promise<Poll> {
    const res = await this.dbm.executeFile<Poll>(
      "poll_vote/get_poll_vote_poll.sql",
      [pollVoteID]
    );
    return res[0];
  }

  /**
   * Creates a poll vote record.
   *
   * @param userID The ID of the user voting on the poll.
   * @param pollID The ID of the poll option.
   * @returns The poll vote record.
   */
  public async vote(userID: number, pollOptionID: number): Promise<PollVote> {
    const poll = await this.dbm.pollOptionService.getPollOptionPoll(
      pollOptionID
    );

    await this.unvote(userID, poll.id);

    const res = await this.dbm.executeFile<PollVote>("poll_vote/vote.sql", [
      userID,
      poll.id,
      pollOptionID,
    ]);
    return res[0];
  }

  /**
   * Removes a user's vote from a poll.
   *
   * @param userID The ID of the user.
   * @param pollID The ID of the poll.
   */
  public async unvote(userID: number, pollID: number): Promise<void> {
    await this.dbm.executeFile("poll_vote/unvote.sql", [userID, pollID]);
  }

  /**
   * Removes a user's vote from a poll given the poll option ID.
   * @param userID The ID of the user.
   * @param pollOptionID The ID of the poll option.
   */
  public async unvoteByPollOptionID(
    userID: number,
    pollOptionID: number
  ): Promise<void> {
    await this.dbm.executeFile("poll_vote/unvote_by_poll_option_id.sql", [
      userID,
      pollOptionID,
    ]);
  }
}
