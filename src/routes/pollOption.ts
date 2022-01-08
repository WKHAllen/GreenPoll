/**
 * Poll option routes.
 * @packageDocumentation
 */

import { Router } from "express";
import { getDBM, getLoggedInUser, getParam, respond, wrapRoute } from "./util";
import { ServiceError } from "../services/util";

/**
 * The poll option router.
 */
export const pollOptionRouter = Router();

// Creates a poll option and returns the resulting record
pollOptionRouter.get(
  "/create_poll_option",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const pollID = getParam(req, "poll_id", "number");
    const value = getParam(req, "value", "string");

    const poll = await dbm.pollService.getPoll(pollID);

    if (user.id === poll.user_id) {
      const pollOption = await dbm.pollOptionService.createPollOption(
        pollID,
        value
      );

      respond(res, {
        id: pollOption.id,
        poll_id: pollOption.poll_id,
        value: pollOption.value,
      });
    } else {
      throw new ServiceError("You do not have permission to edit this poll");
    }
  })
);

// Returns the poll option details
pollOptionRouter.get(
  "/get_poll_option_info",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const pollOptionID = getParam(req, "poll_option_id", "number");

    const pollOption = await dbm.pollOptionService.getPollOption(pollOptionID);

    respond(res, {
      id: pollOption.id,
      poll_id: pollOption.poll_id,
      value: pollOption.value,
    });
  })
);

// Sets the text representation of a poll option
pollOptionRouter.get(
  "/set_poll_option_value",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const pollOptionID = getParam(req, "poll_option_id", "number");
    const newValue = getParam(req, "new_value", "string");

    const poll = await dbm.pollOptionService.getPollOptionPoll(pollOptionID);

    if (user.id === poll.user_id) {
      await dbm.pollOptionService.setPollOptionValue(pollOptionID, newValue);

      respond(res);
    } else {
      throw new ServiceError("You do not have permission to edit this poll");
    }
  })
);

// Returns the poll associated with a poll option
pollOptionRouter.get(
  "/get_poll_option_poll",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const pollOptionID = getParam(req, "poll_option_id", "number");

    const poll = await dbm.pollOptionService.getPollOptionPoll(pollOptionID);

    respond(res, {
      id: poll.id,
      user_id: poll.user_id,
      title: poll.title,
      description: poll.description,
      create_time: poll.create_time,
    });
  })
);

// Deletes a poll option
pollOptionRouter.get(
  "/delete_poll_option",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const pollOptionID = getParam(req, "poll_option_id", "number");

    const poll = await dbm.pollOptionService.getPollOptionPoll(pollOptionID);

    if (user.id === poll.user_id) {
      await dbm.pollOptionService.deletePollOption(pollOptionID);

      respond(res);
    } else {
      throw new ServiceError("You do not have permission to edit this poll");
    }
  })
);
