/**
 * Services for the verify table.
 * @packageDocumentation
 */

import { BaseService } from "./util";
import { User } from "./user";

/**
 * Verify architecture.
 */
export interface Verify {
  id: string;
  email: string;
  create_time: number;
}

/**
 * Verify services.
 */
export class VerifyService extends BaseService {
  /**
   * Creates a verification record and returns the resulting record.
   *
   * @param email The email address of the user being verified.
   * @returns The resulting verification record.
   */
  public async createVerification(email: string): Promise<Verify> {
    const verificationExists = await this.verificationExistsForEmail(email);

    if (!verificationExists) {
      const res = await this.dbm.executeFile<Verify>(
        "verify/create_verification.sql",
        [email]
      );
      return res[0];
    } else {
      const verification = await this.getVerificationForEmail(email);
      return verification;
    }
  }

  /**
   * Returns whether or not a verification record exists.
   *
   * @param verifyID The ID of the verification record.
   * @returns Whether or not the verification record exists.
   */
  public async verificationExists(verifyID: string): Promise<boolean> {
    const res = await this.dbm.executeFile<Verify>(
      "verify/get_verification.sql",
      [verifyID]
    );
    return res.length === 1;
  }

  /**
   * Returns whether or not a verification record exists for a given email address.
   *
   * @param verifyID The email address associated with the verification record.
   * @returns Whether or not the verification record exists for the given email address.
   */
  public async verificationExistsForEmail(email: string): Promise<boolean> {
    const res = await this.dbm.executeFile<Verify>(
      "verify/get_verification_by_email.sql",
      [email]
    );
    return res.length === 1;
  }

  /**
   * Returns a verification record.
   *
   * @param verifyID The ID of the verification record.
   * @returns The verification record.
   */
  public async getVerification(verifyID: string): Promise<Verify> {
    const res = await this.dbm.executeFile<Verify>(
      "verify/get_verification.sql",
      [verifyID]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new Error("Verification record does not exist");
    }
  }

  /**
   * Returns a verification record given an email address.
   *
   * @param email The email address associated with the verification record.
   * @returns The verification record given an email address.
   */
  public async getVerificationForEmail(email: string): Promise<Verify> {
    const res = await this.dbm.executeFile<Verify>(
      "verify/get_verification_by_email.sql",
      [email]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new Error("Verification record does not exist for given email");
    }
  }

  /**
   * Returns the user who created the verification record.
   *
   * @param verifyID The ID of the verification record.
   * @returns The user who created the verification record.
   */
  public async getUserByVerification(verifyID: string): Promise<User> {
    const res = await this.dbm.executeFile<User>(
      "verify/get_user_by_verify_id.sql",
      [verifyID]
    );

    if (res.length === 1) {
      return res[0];
    } else {
      throw new Error("User does not exist for given verify ID");
    }
  }

  /**
   * Deletes a verification record.
   *
   * @param verifyID The ID of the verification record.
   */
  public async deleteVerification(verifyID: string): Promise<void> {
    await this.dbm.executeFile("verify/delete_verification.sql", [verifyID]);
  }

  /**
   * Verifies a user's account and deletes the verification record.
   *
   * @param verifyID The ID of the verification record.
   */
  public async verifyUser(verifyID: string): Promise<void> {
    const valid = await this.verificationExists(verifyID);

    if (valid) {
      const user = await this.getUserByVerification(verifyID);
      await this.deleteVerification(verifyID);
      await this.dbm.userService.setVerified(user.id);
    } else {
      throw new Error("Invalid verify ID");
    }
  }
}
