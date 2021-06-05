/**
 * Utilities for services.
 * @packageDocumentation
 */

import DatabaseManager from "../services";
import * as bcrypt from "bcrypt";

/**
 * Number of salt rounds to use when hashing passwords.
 */
const SALT_ROUNDS = 12;

/**
 * Number of milliseconds a verification record should be active.
 */
const VERIFY_AGE = 60 * 60 * 1000;

/**
 * Number of milliseconds a password reset record should be active.
 */
const PASSWORD_RESET_AGE = 60 * 60 * 1000;

/**
 * Get the current timestamp.
 *
 * @returns The timestamp in seconds.
 */
export function getTime(): number {
  return Math.floor(new Date().getTime() / 1000);
}

/**
 * Base service class.
 */
export abstract class BaseService {
  readonly dbm: DatabaseManager;

  constructor(dbm: DatabaseManager) {
    this.dbm = dbm;
  }
}

/**
 * Custom error type for services.
 */
export class ServiceError extends Error {
  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}

/**
 * Hash a password.
 *
 * @param password The password.
 * @param rounds The number of salt rounds for bcrypt to use.
 * @returns The hashed password.
 */
export async function hashPassword(
  password: string,
  rounds: number = SALT_ROUNDS
): Promise<string> {
  return await bcrypt.hash(password, rounds);
}

/**
 * Check if passwords match.
 *
 * @param password The password.
 * @param hash The hashed password.
 * @returns Whether or not the password and hash match.
 */
export async function checkPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Delete a verification record when the time comes.
 *
 * @param dbm The database manager.
 * @param verifyID A verification ID.
 * @param timeRemaining The amount of time to wait before removing the record.
 */
export async function pruneVerifyRecord(
  dbm: DatabaseManager,
  verifyID: string,
  timeRemaining: number = null
): Promise<void> {
  if (timeRemaining === null) {
    timeRemaining = VERIFY_AGE;
  }

  setTimeout(async () => {
    await dbm.verifyService.deleteUnverifiedUser(verifyID);
  }, timeRemaining);
}

/**
 * Delete all active verification records when the time comes.
 *
 * @param dbm The database manager.
 */
export async function pruneVerifyRecords(dbm: DatabaseManager): Promise<void> {
  const verifyRecords = await dbm.verifyService.getVerifications();

  verifyRecords.forEach((record) => {
    const timeRemaining = record.create_time + VERIFY_AGE / 1000 - getTime();
    pruneVerifyRecord(dbm, record.id, timeRemaining * 1000);
  });
}

/**
 * Delete a password reset record when the time comes.
 *
 * @param dbm The database manager.
 * @param resetID A password reset ID.
 * @param timeRemaining The amount of time to wait before removing the record.
 */
export async function prunePasswordResetRecord(
  dbm: DatabaseManager,
  resetID: string,
  timeRemaining: number = null
): Promise<void> {
  if (timeRemaining === null) {
    timeRemaining = PASSWORD_RESET_AGE;
  }

  setTimeout(async () => {
    await dbm.passwordResetService.deletePasswordReset(resetID);
  }, timeRemaining);
}

/**
 * Delete all active password reset records when the time comes.
 *
 * @param dbm The database manager.
 */
export async function prunePasswordResetRecords(
  dbm: DatabaseManager
): Promise<void> {
  const passwordResetRecords =
    await dbm.passwordResetService.getPasswordResets();

  passwordResetRecords.forEach((record) => {
    const timeRemaining =
      record.create_time + PASSWORD_RESET_AGE / 1000 - getTime();
    prunePasswordResetRecord(dbm, record.id, timeRemaining * 1000);
  });
}
