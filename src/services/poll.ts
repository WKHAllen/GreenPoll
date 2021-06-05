/**
 * Services for the poll table.
 * @packageDocumentation
 */

import { BaseService, ServiceError } from "./util";
import { PollOption } from "./pollOption";
import { PollVote } from "./pollVote";

/**
 * Poll architecture.
 */
export interface Poll {
  id: number;
  user_id: number;
  title: string;
  description: string;
  create_time: number;
}

/**
 * Poll vote and voter information architecture.
 */
export interface PollVoter {
  user_id: number;
  username: string;
  poll_option_id: number;
  poll_option_value: string;
  vote_time: number;
}

/**
 * Poll services.
 */
export class PollService extends BaseService {
  /**
   * Creates a poll and returns the resulting record.
   *
   * @param userID The ID of the user creating the poll.
   * @param title The poll title.
   * @param description The poll description.
   * @returns The poll record.
   */
  public async createPoll(
    userID: number,
    title: string,
    description: string
  ): Promise<Poll> {
    if (title.length < 1 || title.length > 255) {
      throw new ServiceError("Title must be between 1 and 255 characters");
    } else if (description.length > 1023) {
      throw new ServiceError(
        "Description must be no more than 1023 characters"
      );
    } else {
      const res = await this.dbm.executeFile<Poll>("poll/create_poll.sql", [
        userID,
        title,
        description,
      ]);
      return res[0];
    }
  }

  /**
   * Returns whether or not a poll exists.
   *
   * @param pollID The ID of the poll.
   * @returns Whether or not the poll exists.
   */
  public async pollExists(pollID: number): Promise<boolean> {
    const res = await this.dbm.executeFile<Poll>("poll/get_poll", [pollID]);
    return res.length === 1;
  }

  /**
   * Returns a poll.
   *
   * @param pollID The ID of the poll.
   * @returns The poll record.
   */
  public async getPoll(pollID: number): Promise<Poll> {
    const res = await this.dbm.executeFile<Poll>("poll/get_poll", [pollID]);

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("Poll does not exist");
    }
  }

  /**
   * Returns all options associated with a poll.
   *
   * @param pollID The ID of the poll.
   * @returns The options associated with the poll.
   */
  public async getPollOptions(pollID: number): Promise<PollOption[]> {
    const res = await this.dbm.executeFile<PollOption>(
      "poll/get_poll_options.sql",
      [pollID]
    );
    return res;
  }

  /**
   * Returns all votes associated with a poll.
   *
   * @param pollID The ID of the poll.
   * @returns The votes associated with the poll.
   */
  public async getPollVotes(pollID: number): Promise<PollVote[]> {
    const res = await this.dbm.executeFile<PollVote>(
      "poll/get_poll_votes.sql",
      [pollID]
    );
    return res;
  }

  /**
   * Returns all relevant information on users who voted on a poll.
   *
   * @param pollID The ID of the poll.
   * @returns Information on users who voted on the poll.
   */
  public async getPollVoters(pollID: number): Promise<PollVoter[]> {
    const res = await this.dbm.executeFile<PollVoter>(
      "poll/get_poll_voters.sql",
      [pollID]
    );
    return res;
  }

  /**
   * Sets the poll title.
   *
   * @param pollID The ID of the poll.
   * @param title The new poll title.
   */
  public async setTitle(pollID: number, title: string): Promise<void> {
    if (title.length < 1 || title.length > 255) {
      throw new ServiceError("Title must be between 1 and 255 characters");
    } else {
      await this.dbm.executeFile("poll/set_title.sql", [title, pollID]);
    }
  }

  /**
   * Sets the poll description.
   *
   * @param pollID The ID of the poll.
   * @param description The new poll description.
   */
  public async setDescription(
    pollID: number,
    description: string
  ): Promise<void> {
    if (description.length > 1023) {
      throw new ServiceError(
        "Description must be no more than 1023 characters"
      );
    } else {
      await this.dbm.executeFile("poll/set_description.sql", [
        description,
        pollID,
      ]);
    }
  }

  /**
   * Deletes a poll.
   *
   * @param pollID The ID of the poll.
   */
  public async deletePoll(pollID: number): Promise<void> {
    await this.dbm.executeFile("poll/delete_poll.sql", [pollID]);
  }
}
