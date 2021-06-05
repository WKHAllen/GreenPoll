/**
 * Services for the session table.
 * @packageDocumentation
 */

import { BaseService, ServiceError } from "./util";
import { User } from "./user";

/**
 * The maximum number of sessions per user.
 */
const NUM_USER_SESSIONS: number = 4;

/**
 * Session architecture.
 */
export interface Session {
  id: string;
  user_id: number;
  create_time: number;
}

/**
 * Session services.
 */
export class SessionService extends BaseService {
  /**
   * Creates a user session and returns the resulting record.
   *
   * @param userID The ID of the user creating the session.
   * @returns The session record.
   */
  public async createSession(userID: number): Promise<Session> {
    const res = await this.dbm.executeFile<Session>(
      "session/create_session.sql",
      [userID]
    );

    await this.deleteOldUserSessions(userID);

    return res[0];
  }

  /**
   * Returns whether or not a session exists.
   *
   * @param sessionID The ID of the session.
   * @returns Whether or not the session exists.
   */
  public async sessionExists(sessionID: string): Promise<boolean> {
    const res = await this.dbm.executeFile<Session>("session/get_session.sql", [
      sessionID,
    ]);
    return res.length === 1;
  }

  /**
   * Returns a user session record.
   *
   * @param sessionID The ID of the session.
   * @returns The user session record.
   */
  public async getSession(sessionID: string): Promise<Session> {
    const res = await this.dbm.executeFile<Session>("session/get_session.sql", [
      sessionID,
    ]);

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("Session does not exist");
    }
  }

  /**
   * Returns the user associated with a session.
   *
   * @param sessionID The ID of the session.
   * @returns The user associated with the session.
   */
  public async getUserBySessionID(sessionID: string): Promise<User> {
    const res = await this.dbm.executeFile<User>(
      "session/get_user_by_session_id.sql",
      [sessionID]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("User or session does not exist");
    }
  }

  /**
   * Returns all sessions associated with a user.
   *
   * @param userID The ID of the user.
   * @returns The sessions associated with the user.
   */
  public async getUserSessions(userID: number): Promise<Session[]> {
    const res = await this.dbm.executeFile<Session>(
      "session/get_user_sessions.sql",
      [userID]
    );
    return res;
  }

  /**
   * Deletes a user session.
   *
   * @param sessionID The ID of the session.
   */
  public async deleteSession(sessionID: string): Promise<void> {
    await this.dbm.executeFile("session/delete_session.sql", [sessionID]);
  }

  /**
   * Deletes all sessions associated witht a user.
   *
   * @param userID The ID of the user.
   */
  public async deleteUserSessions(userID: number): Promise<void> {
    await this.dbm.executeFile("session/delete_user_sessions.sql", [userID]);
  }

  /**
   * Deletes all old user sessions.
   *
   * @param userID The ID of the user.
   */
  public async deleteOldUserSessions(userID: number): Promise<void> {
    await this.dbm.executeFile("session/delete_old_user_sessions.sql", [
      userID,
      NUM_USER_SESSIONS,
    ]);
  }
}
