/**
 * Services for the user table.
 * @packageDocumentation
 */

import { BaseService, ServiceError, hashPassword, checkPassword } from "./util";
import { Poll } from "./poll";
import { Session } from "./session";

/**
 * User architecture.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  verified: boolean;
  join_time: number;
}

/**
 * User services.
 */
export class UserService extends BaseService {
  /**
   * Creates a user and returns the resulting record.
   *
   * @param username The user's username.
   * @param email The user's email.
   * @param password The user's password.
   * @returns The new user record.
   */
  public async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    const usernameExists = await this.userExistsForUsername(username);
    const emailExists = await this.userExistsForEmail(email);

    if (usernameExists) {
      throw new ServiceError("Username is in use");
    } else if (emailExists) {
      throw new ServiceError("Email is in use");
    } else if (username.length < 3 || username.length > 63) {
      throw new ServiceError("Username must be between 3 and 63 characters");
    } else if (email.length < 5 || email.length > 63) {
      throw new ServiceError("Email must be between 5 and 63 characters");
    } else if (password.length < 8 || password.length > 255) {
      throw new ServiceError("Password must be between 8 and 255 characters");
    } else {
      const passwordHash = await hashPassword(password);

      const res = await this.dbm.executeFile<User>("user/create_user.sql", [
        username,
        email,
        passwordHash,
      ]);
      return res[0];
    }
  }

  /**
   * Returns whether or not a user exists.
   *
   * @param userID The ID of the user.
   * @returns Whether or not the user exists.
   */
  public async userExists(userID: number): Promise<boolean> {
    const res = await this.dbm.executeFile<User>("user/get_user.sql", [userID]);
    return res.length === 1;
  }

  /**
   * Returns whether or not a user exists given a username.
   *
   * @param username The username of the user.
   * @returns Whether or not the user exists.
   */
  public async userExistsForUsername(username: string): Promise<boolean> {
    const res = await this.dbm.executeFile<User>(
      "user/get_user_by_username.sql",
      [username]
    );
    return res.length === 1;
  }

  /**
   * Returns whether or not a user exists given an email address.
   *
   * @param email The email of the user.
   * @returns Whether or not the user exists.
   */
  public async userExistsForEmail(email: string): Promise<boolean> {
    const res = await this.dbm.executeFile<User>("user/get_user_by_email.sql", [
      email,
    ]);
    return res.length === 1;
  }

  /**
   * Returns a user.
   *
   * @param userID The ID of the user.
   * @returns The user record.
   */
  public async getUser(userID: number): Promise<User> {
    const res = await this.dbm.executeFile<User>("user/get_user.sql", [userID]);

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("User does not exist");
    }
  }

  /**
   * Returns a user given a username.
   *
   * @param username The username of the user.
   * @returns Whether or not the user exists.
   */
  public async getUserByUsername(username: string): Promise<User> {
    const res = await this.dbm.executeFile<User>(
      "user/get_user_by_username.sql",
      [username]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("User does not exist");
    }
  }

  /**
   * Returns a user given an email address.
   *
   * @param email The email of the user.
   * @returns Whether or not the user exists.
   */
  public async getUserByEmail(email: string): Promise<User> {
    const res = await this.dbm.executeFile<User>("user/get_user_by_email.sql", [
      email,
    ]);

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("User does not exist");
    }
  }

  /**
   * Sets a user's username.
   *
   * @param userID The ID of the user.
   * @param username The new username.
   */
  public async setUsername(userID: number, username: string): Promise<void> {
    const usernameExists = await this.userExistsForUsername(username);

    if (usernameExists) {
      throw new ServiceError("Username is in use");
    } else if (username.length < 3 || username.length > 63) {
      throw new ServiceError("Username must be between 3 and 63 characters");
    } else {
      await this.dbm.executeFile("user/set_username.sql", [username, userID]);
    }
  }

  /**
   * Sets a user's email address.
   *
   * @param userID The ID of the user.
   * @param email The new email address.
   */
  public async setEmail(userID: number, email: string): Promise<void> {
    const emailExists = await this.userExistsForEmail(email);

    if (emailExists) {
      throw new ServiceError("Email is in use");
    } else if (email.length < 5 || email.length > 63) {
      throw new ServiceError("Email must be between 5 and 63 characters");
    } else {
      await this.dbm.executeFile("user/set_email.sql", [email, userID]);
    }
  }

  /**
   * Sets a user's password.
   *
   * @param userID The ID of the user.
   * @param password The new password.
   */
  public async setPassword(userID: number, password: string): Promise<void> {
    if (password.length < 5 || password.length > 63) {
      throw new ServiceError("Password must be between 8 and 255 characters");
    } else {
      const passwordHash = await hashPassword(password);

      await this.dbm.executeFile("user/set_password.sql", [
        passwordHash,
        userID,
      ]);
    }
  }

  /**
   * Sets a user's verified status.
   *
   * @param userID The ID of the user.
   * @param verified The new verified status.
   */
  public async setVerified(
    userID: number,
    verified: boolean = true
  ): Promise<void> {
    await this.dbm.executeFile("user/set_verified.sql", [verified, userID]);
  }

  /**
   * Returns all polls created by a user.
   *
   * @param userID The ID of the user.
   * @returns The polls created by the user.
   */
  public async getUserPolls(userID: number): Promise<Poll[]> {
    const polls = await this.dbm.executeFile<Poll>("user/get_user_polls.sql", [
      userID,
    ]);
    return polls;
  }

  /**
   * Returns all polls the user has voted on.
   *
   * @param userID The ID of the user.
   * @returns The polls the user has voted on.
   */
  public async getUserVotePolls(userID: number): Promise<Poll[]> {
    const polls = await this.dbm.executeFile<Poll>(
      "user/get_user_vote_polls.sql",
      [userID]
    );
    return polls;
  }

  /**
   * Logs a user in and returns the new session.
   *
   * @param email The user's email address.
   * @param password The user's password.
   * @returns The new user session.
   */
  public async login(email: string, password: string): Promise<Session> {
    const userExists = await this.userExistsForEmail(email);

    if (userExists) {
      const user = await this.getUserByEmail(email);

      const passwordMatch = await checkPassword(password, user.password);

      if (passwordMatch) {
        const session = await this.dbm.sessionService.createSession(user.id);
        return session;
      } else {
        throw new ServiceError("Invalid login");
      }
    } else {
      throw new ServiceError("Invalid login");
    }
  }

  /**
   * Deletes a user.
   *
   * @param userID The ID of the user.
   */
  public async deleteUser(userID: number): Promise<void> {
    await this.dbm.executeFile("user/delete_user.sql", [userID]);
  }

  /**
   * Prunes all old unverified accounts.
   */
  public async pruneUnverifiedUsers(): Promise<void> {
    await this.dbm.executeFile("user/prune_unverified_users.sql");
  }
}
