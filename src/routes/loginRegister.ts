/**
 * Login and registration routes.
 * @packageDocumentation
 */

import { Router } from "express";
import {
  getDBM,
  getHostname,
  getSessionID,
  setSessionID,
  deleteSessionID,
  getLoggedInUser,
  getParam,
  respond,
  wrapRoute,
} from "./util";
import { sendFormattedEmail } from "../emailer";

/**
 * The login and registration router.
 */
export const loginRegisterRouter = Router();

// Registers an account
loginRegisterRouter.get(
  "/register",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const username = getParam(req, "username", "string");
    const email = getParam(req, "email", "string");
    const password = getParam(req, "password", "string");

    const user = await dbm.userService.createUser(username, email, password);
    const verification = await dbm.verifyService.createVerification(email);

    sendFormattedEmail(email, "GreenPoll - Verify Account", "verify", {
      url: getHostname(req),
      verify_id: verification.id,
    });

    respond(res);
  })
);

// Logs in using email and password
loginRegisterRouter.get(
  "/login",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const email = getParam(req, "email", "string");
    const password = getParam(req, "password", "string");

    const session = await dbm.userService.login(email, password);
    setSessionID(res, session.id);

    respond(res);
  })
);

// Logs out
loginRegisterRouter.get(
  "/logout",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const sessionID = getSessionID(req);

    if (sessionID) {
      await dbm.sessionService.deleteSession(sessionID);
      deleteSessionID(res);
    }

    respond(res);
  })
);

// Logs out everywhere, removing all sessions
loginRegisterRouter.get(
  "/logout_everywhere",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const user = await getLoggedInUser(req);

    await dbm.sessionService.deleteUserSessions(user.id);
    deleteSessionID(res);

    respond(res);
  })
);
