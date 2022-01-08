/**
 * Verification routes.
 * @packageDocumentation
 */

import { Router } from "express";
import { getDBM, getParam, respond, wrapRoute } from "./util";

/**
 * The verification router.
 */
export const verificationRouter = Router();

// Verifies a user's account
verificationRouter.get(
  "/verify_account",
  wrapRoute(async (req, res) => {
    const dbm = getDBM(req);
    const verifyID = getParam(req, "verify_id", "string");

    await dbm.verifyService.verifyUser(verifyID);

    respond(res);
  })
);
