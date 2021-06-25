/**
 * User routes.
 * @packageDocumentation
 */

import { Router } from "express";
import { getDBM, getLoggedInUser, getParam, respond, wrapRoute } from "./util";

/**
 * The user router.
 */
export const userRouter = Router();

// Returns a user's details
userRouter.get(
  "/get_user_info",
  wrapRoute(async (req, res) => {
    const user = await getLoggedInUser(req);

    respond(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      join_time: user.join_time,
    });
  })
);

// Returns a specified user's details
userRouter.get(
  "/get_specific_user_info",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const userID = getParam(req, "user_id", "number");

    const user = await dbm.userService.getUser(userID);

    respond(res, {
      id: user.id,
      username: user.username,
      join_time: user.join_time,
    });
  })
);

// Sets a user's username
userRouter.get(
  "/set_username",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const newUsername = getParam(req, "new_username", "string");

    await dbm.userService.setUsername(user.id, newUsername);

    respond(res);
  })
);

// Sets a user's password
userRouter.get(
  "/set_password",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);
    const newPassword = getParam(req, "new_password", "string");

    await dbm.userService.setPassword(user.id, newPassword);

    respond(res);
  })
);

// Gets a user's polls
userRouter.get(
  "/get_user_polls",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);

    const userPolls = await dbm.userService.getUserPolls(user.id);
    const polls = userPolls.map((poll) => ({
      id: poll.id,
      user_id: poll.user_id,
      title: poll.title,
      description: poll.description,
      create_time: poll.create_time,
    }));

    respond(res, polls);
  })
);

// Gets the polls a user has voted on
userRouter.get(
  "/get_user_vote_polls",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);

    const userVotePolls = await dbm.userService.getUserVotePolls(user.id);
    const votePolls = userVotePolls.map((poll) => ({
      id: poll.id,
      user_id: poll.user_id,
      title: poll.title,
      description: poll.description,
      create_time: poll.create_time,
    }));

    respond(res, votePolls);
  })
);
