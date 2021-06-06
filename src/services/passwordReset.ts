/**
 * Services for the password reset table.
 * @packageDocumentation
 */

import { BaseService, ServiceError } from "./util";
import { User } from "./user";

/**
 * Password reset architecture.
 */
export interface PasswordReset {
  id: string;
  email: string;
  create_time: number;
}

/**
 * Password reset services.
 */
export class PasswordResetService extends BaseService {
  /**
   * Creates a password reset record and returns the resulting record.
   *
   * @param email The email address of the user requesting the password reset.
   * @returns The password reset record.
   */
  public async createPasswordReset(email: string): Promise<PasswordReset> {
    const passwordResetExists = await this.passwordResetExists(email);

    if (!passwordResetExists) {
      const res = await this.dbm.executeFile<PasswordReset>(
        "password_reset/create_password_reset.sql",
        [email]
      );

      return res[0];
    } else {
      const passwordReset = await this.getPasswordResetForEmail(email);
      return passwordReset;
    }
  }

  /**
   * Returns whether or not a password reset record exists.
   *
   * @param passwordResetID The ID of thhe password reset record.
   * @returns Whether or not a password reset record exists.
   */
  public async passwordResetExists(passwordResetID: string): Promise<boolean> {
    const res = await this.dbm.executeFile<PasswordReset>(
      "password_reset/get_password_reset.sql",
      [passwordResetID]
    );
    return res.length === 1;
  }

  /**
   * Returns whether or not a password reset record exists given an email address.
   *
   * @param email The email address associated with the password reset record.
   * @returns Whether or not a password reset record exists for the given email address.
   */
  public async passwordResetExistsForEmail(email: string): Promise<boolean> {
    const res = await this.dbm.executeFile<PasswordReset>(
      "password_reset/get_password_reset_by_email.sql",
      [email]
    );
    return res.length === 1;
  }

  /**
   * Returns a password reset record.
   *
   * @param passwordResetID The ID of the password reset record.
   * @returns The password reset record.
   */
  public async getPasswordReset(
    passwordResetID: string
  ): Promise<PasswordReset> {
    const res = await this.dbm.executeFile<PasswordReset>(
      "password_reset/get_password_reset.sql",
      [passwordResetID]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("Password reset record does not exist");
    }
  }

  /**
   * Returns a password reset record given an email address.
   *
   * @param email The email address associated with the password reset record.
   * @returns The password reset record for the given email address.
   */
  public async getPasswordResetForEmail(email: string): Promise<PasswordReset> {
    const res = await this.dbm.executeFile<PasswordReset>(
      "password_reset/get_password_reset_by_email.sql",
      [email]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError(
        "Password reset record does not exist for given email"
      );
    }
  }

  /**
   * Returns all password reset records.
   *
   * @returns All password reset records.
   */
  public async getPasswordResets(): Promise<PasswordReset[]> {
    const res = await this.dbm.executeFile<PasswordReset>(
      "password_reset/get_password_resets.sql"
    );
    return res;
  }

  /**
   * Returns the user who created a password reset record.
   *
   * @param passwordResetID The ID of the password reset record.
   * @returns The user who created the password reset record.
   */
  public async getUserByPasswordReset(passwordResetID: string): Promise<User> {
    const res = await this.dbm.executeFile<User>(
      "password_reset/get_user_by_password_reset_id.sql",
      [passwordResetID]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new ServiceError("User does not exist for given password reset ID");
    }
  }

  /**
   * Deletes a password reset record.
   *
   * @param passwordResetID The ID of the password reset record.
   */
  public async deletePasswordReset(passwordResetID: string): Promise<void> {
    await this.dbm.executeFile("password_reset/delete_password_reset.sql", [
      passwordResetID,
    ]);
  }

  /**
   * Resets a user's password and deletes thhe password reset record.
   *
   * @param passwordResetID The ID of the password reset record.
   * @param newPassword The user's new password.
   */
  public async resetPassword(
    passwordResetID: string,
    newPassword: string
  ): Promise<void> {
    const valid = await this.passwordResetExists(passwordResetID);

    if (valid) {
      const user = await this.getUserByPasswordReset(passwordResetID);
      await this.deletePasswordReset(passwordResetID);
      await this.dbm.userService.setPassword(user.id, newPassword);
    } else {
      throw new ServiceError("Invalid password reset ID");
    }
  }

  /**
   * Prunes all old password reset records.
   */
  public async prunePasswordResets(): Promise<void> {
    await this.dbm.executeFile("password_reset/prune_password_resets.sql");
  }
}
