/**
 * Poll vote routes.
 * @packageDocumentation
 */

import { Router } from "express";
import { getDBM, getLoggedInUser, getParam, respond, wrapRoute } from "./util";

/**
 * The poll vote router.
 */
export const pollVoteRouter = Router();

// Votes on a poll and returns the resulting record
pollVoteRouter.get(
  "/poll_vote",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const pollOptionID = getParam(req, "poll_option_id", "number");

    const vote = await dbm.pollVoteService.vote(user.id, pollOptionID);

    respond(res, {
      id: vote.id,
      user_id: vote.user_id,
      poll_id: vote.poll_id,
      poll_option_id: vote.poll_option_id,
      vote_time: vote.vote_time,
    });
  })
);

// Removes a vote from a poll
pollVoteRouter.get(
  "/poll_unvote",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const pollID = getParam(req, "poll_id", "number");

    await dbm.pollVoteService.unvote(user.id, pollID);

    respond(res);
  })
);

// Returns the poll associated with a poll vote
pollVoteRouter.get(
  "/get_poll_vote_poll",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const pollVoteID = getParam(req, "poll_vote_id", "number");

    const poll = await dbm.pollVoteService.getPollVotePoll(pollVoteID);

    respond(res, {
      id: poll.id,
      user_id: poll.user_id,
      title: poll.title,
      description: poll.description,
      create_time: poll.create_time,
    });
  })
);

// Returns the vote the current user created on a poll
pollVoteRouter.get(
  "/get_user_vote",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const pollID = getParam(req, "poll_id", "number");

    const vote = await dbm.pollVoteService.getPollVote(user.id, pollID);

    respond(res, {
      id: vote.id,
      user_id: vote.user_id,
      poll_id: vote.poll_id,
      poll_option_id: vote.poll_option_id,
      vote_time: vote.vote_time,
    });
  })
);
