/**
 * Poll routes.
 * @packageDocumentation
 */

import { Router } from "express";
import { getDBM, getLoggedInUser, getParam, respond, wrapRoute } from "./util";
import { ServiceError } from "../services/util";

/**
 * The poll router.
 */
export const pollRouter = Router();

// Creates a poll and returns the resulting record
pollRouter.get(
  "/create_poll",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const title = getParam(req, "title", "string");
    const description = getParam(req, "description", "string");

    const poll = await dbm.pollService.createPoll(user.id, title, description);

    respond(res, {
      id: poll.id,
      user_id: poll.user_id,
      title: poll.title,
      description: poll.description,
      create_time: poll.create_time,
    });
  })
);

// Returns thhe poll details
pollRouter.get(
  "/get_poll_info",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const pollID = getParam(req, "poll_id", "number");

    const poll = await dbm.pollService.getPoll(pollID);

    respond(res, {
      id: poll.id,
      user_id: poll.user_id,
      title: poll.title,
      description: poll.description,
      create_time: poll.create_time,
    });
  })
);

// Returns all poll options associated with a poll
pollRouter.get(
  "/get_poll_options",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const pollID = getParam(req, "poll_id", "number");

    const pollOptions = await dbm.pollService.getPollOptions(pollID);
    const options = pollOptions.map((option) => ({
      id: option.id,
      poll_id: option.poll_id,
      value: option.value,
    }));

    respond(res, options);
  })
);

// Returns all poll votes associated with a poll
pollRouter.get(
  "/get_poll_votes",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const pollID = getParam(req, "poll_id", "number");

    const pollVotes = await dbm.pollService.getPollVotes(pollID);
    const votes = pollVotes.map((vote) => ({
      id: vote.id,
      user_id: vote.user_id,
      poll_id: vote.poll_id,
      poll_option_id: vote.poll_option_id,
      vote_time: vote.vote_time,
    }));

    respond(res, votes);
  })
);

// Returns all poll voters
pollRouter.get(
  "/get_poll_voters",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const pollID = getParam(req, "poll_id", "number");

    const pollVoters = await dbm.pollService.getPollVoters(pollID);
    const voters = pollVoters.map((voter) => ({
      user_id: voter.user_id,
      username: voter.username,
      poll_option_id: voter.poll_option_id,
      poll_option_value: voter.poll_option_value,
      vote_time: voter.vote_time,
    }));

    respond(res, voters);
  })
);

// Sets a poll's title
pollRouter.get(
  "/set_poll_title",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const pollID = getParam(req, "poll_id", "number");
    const title = getParam(req, "title", "string");

    const poll = await dbm.pollService.getPoll(pollID);

    if (user.id === poll.user_id) {
      await dbm.pollService.setTitle(pollID, title);

      respond(res);
    } else {
      throw new ServiceError("You do not have permission to edit this poll");
    }
  })
);

// Sets a poll's description
pollRouter.get(
  "/set_poll_description",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const pollID = getParam(req, "poll_id", "number");
    const description = getParam(req, "description", "string");

    const poll = await dbm.pollService.getPoll(pollID);

    if (user.id === poll.user_id) {
      await dbm.pollService.setDescription(pollID, description);

      respond(res);
    } else {
      throw new ServiceError("You do not have permission to edit this poll");
    }
  })
);

// Deletes a poll
pollRouter.get(
  "/delete_poll",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const pollID = getParam(req, "poll_id", "number");

    const poll = await dbm.pollService.getPoll(pollID);

    if (user.id === poll.user_id) {
      await dbm.pollService.deletePoll(pollID);

      respond(res);
    } else {
      throw new ServiceError("You do not have permission to delete this poll");
    }
  })
);
