/**
 * Services for the poll option table.
 * @packageDocumentation
 */

import { BaseService, ServiceError } from "./util";
import { Poll } from "./poll";

/**
 * The maximum number of options per poll.
 */
const NUM_POLL_OPTIONS: number = 5;

/**
 * Poll option architecture.
 */
export interface PollOption {
  id: number;
  poll_id: number;
  value: string;
}

/**
 * Poll option services.
 */
export class PollOptionService extends BaseService {
  /**
   * Creates a poll option and returns the resulting record.
   *
   * @param pollID The ID of the poll.
   * @param value The text representing the poll option.
   * @returns The poll option record.
   */
  public async createPollOption(
    pollID: number,
    value: string
  ): Promise<PollOption> {
    const numPollOptions = await this.getNumPollOptions(pollID);

    if (numPollOptions >= NUM_POLL_OPTIONS) {
      throw new ServiceError("Maximum number of poll options has been reached");
    } else if (value.length < 1 || value.length > 255) {
      throw new ServiceError(
        "Option text must be between 1 and 255 characters"
      );
    } else {
      const res = await this.dbm.executeFile<PollOption>(
        "poll_option/create_poll_option.sql",
        [pollID, value]
      );
      return res[0];
    }
  }

  /**
   * Returns whether or not a poll option exists.
   *
   * @param pollOptionID The ID of the poll option.
   * @returns Whether or not the poll option exists.
   */
  public async pollOptionExists(pollOptionID: number): Promise<boolean> {
    const res = await this.dbm.executeFile<PollOption>(
      "poll_option/get_poll_option.sql",
      [pollOptionID]
    );
    return res.length === 1;
  }

  /**
   * Returns a poll option.
   *
   * @param pollOptionID The ID of the poll option.
   * @returns The poll option record.
   */
  public async getPollOption(pollOptionID: number): Promise<PollOption> {
    const res = await this.dbm.executeFile<PollOption>(
      "poll_option/get_poll_option.sql",
      [pollOptionID]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("Poll option does not exist");
    }
  }

  /**
   * Returns the poll associated with the poll option.
   *
   * @param pollOptionID The ID of the poll option.
   * @returns The poll associated with the poll option.
   */
  public async getPollOptionPoll(pollOptionID: number): Promise<Poll> {
    const res = await this.dbm.executeFile<Poll>(
      "poll_option/get_poll_option_poll.sql",
      [pollOptionID]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("Poll option does not exist");
    }
  }

  /**
   * Sets the text representing the poll option.
   *
   * @param pollOptionID The ID of the poll option.
   * @param value The new text representing the poll option.
   */
  public async setPollOptionValue(
    pollOptionID: number,
    value: string
  ): Promise<void> {
    if (value.length < 1 || value.length > 255) {
      throw new ServiceError(
        "Option text must be between 1 and 255 characters"
      );
    } else {
      await this.dbm.executeFile("poll_option/set_poll_option_value.sql", [
        value,
        pollOptionID,
      ]);
    }
  }

  /**
   * Returns the number of options for a given poll.
   *
   * @param pollID The ID of the poll.
   * @returns The number of options for the given poll.
   */
  public async getNumPollOptions(pollID: number): Promise<number> {
    const pollOptions = await this.dbm.pollService.getPollOptions(pollID);
    return pollOptions.length;
  }

  /**
   * Deletes a poll option.
   *
   * @param pollOptionID The ID of the poll option.
   */
  public async deletePollOption(pollOptionID: number): Promise<void> {
    await this.dbm.executeFile("poll_option/delete_poll_option.sql", [
      pollOptionID,
    ]);
  }
}
