/**
 * Password reset routes.
 * @packageDocumentation
 */

import { Router } from "express";
import { getDBM, getHostname, getParam, respond, wrapRoute } from "./util";
import { sendFormattedEmail } from "../emailer";

/**
 * The password reset router.
 */
export const passwordResetRouter = Router();

// Requests a password reset
passwordResetRouter.get(
  "/request_password_reset",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const email = getParam(req, "email", "string");

    const passwordReset = await dbm.passwordResetService.createPasswordReset(
      email
    );

    sendFormattedEmail(email, "GreenPoll - Password Reset", "password_reset", {
      url: getHostname(req),
      reset_id: passwordReset.id,
    });

    respond(res);
  })
);

// Checks whether or not a password reset record exists
passwordResetRouter.get(
  "/password_reset_exists",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const resetID = getParam(req, "reset_id", "string");

    const exists = await dbm.passwordResetService.passwordResetExists(resetID);

    respond(res, exists);
  })
);

// Resets a password
passwordResetRouter.get(
  "/reset_password",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const resetID = getParam(req, "reset_id", "string");
    const newPassword = getParam(req, "new_password", "string");

    await dbm.passwordResetService.resetPassword(resetID, newPassword);

    respond(res);
  })
);
